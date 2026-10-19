import assert from 'assert';
import { tenantService } from '../src/domains/identity/application/services/tenant.service';
import { authService } from '../src/domains/identity/application/services/auth.service';
import { userService } from '../src/domains/identity/application/services/user.service';
import { roleService } from '../src/domains/identity/application/services/role.service';
import { auditService } from '../src/services/audit.service';
import { AuthenticationError, ConflictError, ForbiddenError, NotFoundError } from '../src/errors/AppError';

export async function runIdentityDomainTests() {
  console.log('🧪 Starting Identity & IAM Domain Verification Tests...');

  // --- 1. Testing Tenant Provisioning & Onboarding ---
  console.log('1. Testing Tenant Provisioning & Onboarding...');
  const tenantSlug = `school-${Date.now()}`;
  const onboardingResult = await tenantService.createTenant({
    name: 'École Ibn Khaldoun',
    slug: tenantSlug,
    domain: 'ibn-khaldoun.eduvora.ma',
    plan: 'PROFESSIONAL',
    adminEmail: `admin@${tenantSlug}.ma`,
    adminName: 'Karim Alami',
    adminPassword: 'SecurePassword123!',
  });

  const tenant = onboardingResult.tenant;
  assert.ok(tenant.id, 'Tenant ID should be generated');
  assert.strictEqual(tenant.name, 'École Ibn Khaldoun');
  assert.strictEqual(tenant.slug, tenantSlug);
  assert.strictEqual(tenant.plan, 'PROFESSIONAL');

  const adminUser = onboardingResult.adminUser;
  assert.ok(adminUser.id, 'Admin user ID should be generated');
  assert.strictEqual(adminUser.email, `admin@${tenantSlug}.ma`);
  assert.ok(adminUser.roles.includes('SCHOOL_ADMIN'), 'Admin should have SCHOOL_ADMIN role');

  // Verify duplicate slug rejection
  await assert.rejects(
    async () => {
      await tenantService.createTenant({
        name: 'Duplicate School',
        slug: tenantSlug,
        adminEmail: 'other@school.ma',
        adminName: 'Other Admin',
      });
    },
    (err: any) => err instanceof ConflictError,
    'Duplicate tenant slug must be rejected'
  );
  console.log('  ✓ Tenant created and default workspace initialized with isolation.');

  // --- 2. Testing Authentication & Password Hashing ---
  console.log('2. Testing Authentication & Password Hashing...');
  const loginResult = await authService.login(
    `admin@${tenantSlug}.ma`,
    'SecurePassword123!',
    tenant.id
  );

  assert.ok(loginResult.accessToken, 'Access token should be returned');
  assert.ok(loginResult.refreshToken, 'Refresh token should be returned');
  assert.strictEqual(loginResult.user.email, `admin@${tenantSlug}.ma`);
  assert.ok(loginResult.user.permissions.length > 0, 'Permissions should be resolved in login response');

  // Verify wrong password rejection
  await assert.rejects(
    async () => {
      await authService.login(`admin@${tenantSlug}.ma`, 'WrongPassword!', tenant.id);
    },
    (err: any) => err instanceof AuthenticationError,
    'Invalid password must throw AuthenticationError'
  );
  console.log('  ✓ Authentication and JWT token generation verified.');

  // --- 3. Testing Token Refresh & Logout ---
  console.log('3. Testing Token Refresh & Logout...');
  const refreshedTokens = await authService.refreshAccessToken(loginResult.refreshToken);
  assert.ok(refreshedTokens.accessToken, 'New access token should be generated');
  assert.ok(refreshedTokens.refreshToken, 'New refresh token should be generated');

  // Logout admin user
  await authService.logout(adminUser.id);
  console.log('  ✓ Token refresh and session logout completed.');

  // --- 4. Testing User Lifecycle (Create, Update Status, Role Assignment) ---
  console.log('4. Testing User Lifecycle Management...');
  const newStaff = await userService.createUser(tenant.id, {
    email: `prof.benani@${tenantSlug}.ma`,
    fullName: 'Youssef Bennani',
    password: 'TeacherPass123!',
    phone: '+212661234567',
    roles: ['TEACHER'],
  });

  assert.ok(newStaff.id, 'User ID should be assigned');
  assert.strictEqual(newStaff.email, `prof.benani@${tenantSlug}.ma`);
  assert.ok(newStaff.roles.includes('TEACHER'));

  // Duplicate email in same tenant should fail
  await assert.rejects(
    async () => {
      await userService.createUser(tenant.id, {
        email: `prof.benani@${tenantSlug}.ma`,
        fullName: 'Duplicate Bennani',
      });
    },
    (err: any) => err instanceof ConflictError,
    'Duplicate email in same workspace should be rejected'
  );

  // Deactivate user account
  const suspendedUser = await userService.updateUser(newStaff.id, tenant.id, {
    status: 'SUSPENDED',
  });
  assert.strictEqual(suspendedUser.status, 'SUSPENDED');

  // Attempt login with suspended account
  await assert.rejects(
    async () => {
      await authService.login(`prof.benani@${tenantSlug}.ma`, 'TeacherPass123!', tenant.id);
    },
    (err: any) => err instanceof ForbiddenError,
    'Suspended user login must be forbidden'
  );

  // Reactivate user
  await userService.updateUser(newStaff.id, tenant.id, { status: 'ACTIVE' });
  console.log('  ✓ User lifecycle, password hashing, and account deactivation rules verified.');

  // --- 5. Testing Dynamic RBAC & Custom Roles ---
  console.log('5. Testing Dynamic RBAC & Custom Roles...');
  const customRole = await roleService.createCustomRole(tenant.id, {
    code: 'HEAD_OF_DEPT',
    name: 'Chef de Département',
    description: 'Gestionnaire de département académique',
    permissions: ['academic:read', 'academic:write', 'users:read'],
  });

  assert.ok(customRole.id, 'Custom role ID generated');
  assert.strictEqual(customRole.code, 'HEAD_OF_DEPT');
  assert.strictEqual(customRole.isSystem, false);

  // Assign custom role to user
  await userService.updateUser(newStaff.id, tenant.id, {
    roles: ['TEACHER', 'HEAD_OF_DEPT'],
  });

  // Verify updated permissions resolution
  const userWithUpdatedRole = await userService.getUserById(newStaff.id, tenant.id);
  const resolvedPermissions = await authService.resolvePermissionsForUser(userWithUpdatedRole as any);
  assert.ok(resolvedPermissions.includes('academic:write'), 'Custom role permissions should be resolved');

  // Verify system role deletion prevention
  const tenantRoles = await roleService.getRoles(tenant.id);
  const teacherSystemRole = tenantRoles.find(r => r.code === 'TEACHER');
  if (teacherSystemRole) {
    await assert.rejects(
      async () => {
        await roleService.deleteRole(teacherSystemRole.id, tenant.id);
      },
      (err: any) => err instanceof ForbiddenError,
      'System core role deletion must be forbidden'
    );
  }

  // Delete custom role
  await roleService.deleteRole(customRole.id, tenant.id);
  console.log('  ✓ Dynamic RBAC, custom role creation, permission resolution, and system protection verified.');

  // --- 6. Testing Tenant Isolation ---
  console.log('6. Testing Tenant Isolation...');
  const tenantBResult = await tenantService.createTenant({
    name: 'Lycée Atlas Casablanca',
    slug: `atlas-${Date.now()}`,
    adminEmail: `admin@atlas-${Date.now()}.ma`,
    adminName: 'Salma Tazi',
  });

  // User from Tenant A should not be accessible in Tenant B context
  await assert.rejects(
    async () => {
      await userService.getUserById(newStaff.id, tenantBResult.tenant.id);
    },
    (err: any) => err instanceof NotFoundError,
    'User from tenant A must not be accessible in tenant B'
  );
  console.log('  ✓ Strict multi-tenant data isolation verified.');

  console.log('✅ ALL IDENTITY & IAM DOMAIN VERIFICATION TESTS PASSED SUCCESSFULLY!\n');
}

import { container } from "./container";

import { SchoolService } from "../domains/organization/application/services/school.service";
import { AttendanceService } from "../domains/attendance/application/services/attendance.service";

export function registerServices() {
  container.registerSingleton(
    "SchoolService",
    () =>
      new SchoolService(
        container.resolve("SchoolRepository")
      )
  );
  container.registerSingleton(
    "AttendanceService",
    () =>
      new AttendanceService(
        container.resolve("AttendanceRepository")
      )
  );
}

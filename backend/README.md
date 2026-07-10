# Payline Payroll Portal — Backend (Spring Boot + MySQL)

Spring Boot 3.3 (Java 21) backend for the Payroll Portal demo. Provides login for
both **Payline-side** and **client-side** users, plus endpoints for the payroll
cycle, file upload/download, and user management. The payroll cycle mirrors the
9-step workflow in `Payroll_Cycle_Workflow.pdf`.

## Prerequisites (Windows laptop)

1. **JDK 21** — verify with `java -version`.
2. **Maven** — either install Maven, or run from an IDE (IntelliJ/VS Code) that
   bundles it. Verify with `mvn -version`.
3. **MySQL 8** running locally (or on the static-IP server). Create a database
   user, or let the app auto-create the database (the JDBC URL has
   `createDatabaseIfNotExist=true`).

## Configure

Defaults live in `src/main/resources/application.properties`. Override via
environment variables (recommended) or by editing the file:

| Setting        | Env var          | Default                       |
|----------------|------------------|-------------------------------|
| DB host        | `DB_HOST`        | `localhost`                   |
| DB port        | `DB_PORT`        | `3306`                        |
| DB name        | `DB_NAME`        | `payroll_portal`              |
| DB user        | `DB_USER`        | `payline`                     |
| DB password    | `DB_PASSWORD`    | `payline`                     |
| File store dir | `STORAGE_ROOT`   | `./storage`                   |
| JWT secret     | `JWT_SECRET`     | (demo placeholder — change!)  |
| Allowed CORS   | `CORS_ORIGINS`   | `http://localhost:4200`       |

For the demo on a static-IP server, set for example:
```
set STORAGE_ROOT=C:/payline/storage
set CORS_ORIGINS=http://localhost:4200,http://<STATIC_IP>:4200
set JWT_SECRET=<a-long-random-string-of-at-least-32-characters>
```

## Run

```
cd backend
mvn spring-boot:run
```

The API starts on `http://localhost:8080`. On first run it seeds demo accounts
and prints them to the console:

| Side    | Email                | Password    | Role            |
|---------|----------------------|-------------|-----------------|
| Payline | admin@payline.in     | Admin@123   | PAYLINE_ADMIN   |
| Payline | ops@payline.in       | Ops@123     | PAYLINE_OPS     |
| Client  | admin@acme.com       | Client@123  | CLIENT_ADMIN    |
| Client  | reviewer@acme.com    | Review@123  | CLIENT_REVIEWER |

> These are demo credentials. Change them before any real deployment.

## Using SQL Server instead of MySQL

Not finalized in the design, so both are supported:

1. In `pom.xml`, comment out the `mysql-connector-j` dependency and uncomment
   the `mssql-jdbc` dependency.
2. Run with the `sqlserver` profile:
   ```
   mvn spring-boot:run -Dspring-boot.run.profiles=sqlserver
   ```
   (settings are in `application-sqlserver.properties`).

## Key endpoints

- `POST /api/auth/login` — `{ email, password }` → JWT + user/side info
- `GET  /api/health` — health check (no auth)
- `GET  /api/admin/users`, `POST /api/admin/users` — user management (PAYLINE_ADMIN)
- `GET  /api/cycles`, `POST /api/cycles/open` — payroll cycles
- `POST /api/cycles/{id}/client-transition?target=...` — client actions (upload/approve/reject/pay)
- `POST /api/cycles/{id}/payline-transition?target=...` — Payline actions (process/reports/bankfile/challans/close)
- `GET/POST /api/files`, `GET /api/files/{id}/download` — file storage

All endpoints except login/health require the `Authorization: Bearer <token>` header.

## Notes / next steps

- `spring.jpa.hibernate.ddl-auto=update` auto-creates tables for the demo. For
  production, switch to a migration tool (Flyway/Liquibase) and set this to
  `validate`.
- File bytes are written to `STORAGE_ROOT` on disk; only metadata is stored in
  the DB. On the Windows server, point `STORAGE_ROOT` at a dedicated folder.
- Passwords are BCrypt-hashed; auth is stateless JWT (8-hour expiry by default).

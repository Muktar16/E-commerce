import { Module } from "@nestjs/common";
import { SharedModule } from "../shared.module";
// import { CustomJwtAuthGuard } from "./custom-jwt-auth.guard";
import { RoleGuard } from "./role.guard";

@Module({
    imports: [SharedModule],
    controllers: [],
    providers: [RoleGuard],
    exports: []
})

export class GuardsModule {}
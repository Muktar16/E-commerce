import { Module } from "@nestjs/common";
import { RoleGuard } from "./role.guard";

@Module({
    imports: [],
    controllers: [],
    providers: [RoleGuard],
    exports: []
})

export class GuardsModule {}
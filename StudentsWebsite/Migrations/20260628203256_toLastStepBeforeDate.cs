using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StudentsWebsite.Migrations
{
    /// <inheritdoc />
    public partial class toLastStepBeforeDate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_StudentDailyProgresses_ProgressTypes_ProgressTypeId",
                table: "StudentDailyProgresses");

            migrationBuilder.AlterColumn<int>(
                name: "ProgressTypeId",
                table: "StudentDailyProgresses",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<string>(
                name: "Content",
                table: "StudentDailyProgresses",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddColumn<string>(
                name: "ProgressType",
                table: "StudentDailyProgresses",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddForeignKey(
                name: "FK_StudentDailyProgresses_ProgressTypes_ProgressTypeId",
                table: "StudentDailyProgresses",
                column: "ProgressTypeId",
                principalTable: "ProgressTypes",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_StudentDailyProgresses_ProgressTypes_ProgressTypeId",
                table: "StudentDailyProgresses");

            migrationBuilder.DropColumn(
                name: "ProgressType",
                table: "StudentDailyProgresses");

            migrationBuilder.AlterColumn<int>(
                name: "ProgressTypeId",
                table: "StudentDailyProgresses",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Content",
                table: "StudentDailyProgresses",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_StudentDailyProgresses_ProgressTypes_ProgressTypeId",
                table: "StudentDailyProgresses",
                column: "ProgressTypeId",
                principalTable: "ProgressTypes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}

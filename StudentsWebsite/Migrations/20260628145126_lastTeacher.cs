using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StudentsWebsite.Migrations
{
    /// <inheritdoc />
    public partial class lastTeacher : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "strength",
                table: "studentQuranProgresses",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "LastTeacher",
                table: "studentQuranProgresses",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LastTeacher",
                table: "studentQuranProgresses");

            migrationBuilder.AlterColumn<string>(
                name: "strength",
                table: "studentQuranProgresses",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");
        }
    }
}

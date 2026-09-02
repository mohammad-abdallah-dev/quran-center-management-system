using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StudentsWebsite.Migrations
{
    /// <inheritdoc />
    public partial class AddStudentQuranProgress : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_StudentQuranProgress_Students_StudentId",
                table: "StudentQuranProgress");

            migrationBuilder.DropPrimaryKey(
                name: "PK_StudentQuranProgress",
                table: "StudentQuranProgress");

            migrationBuilder.RenameTable(
                name: "StudentQuranProgress",
                newName: "studentQuranProgresses");

            migrationBuilder.RenameIndex(
                name: "IX_StudentQuranProgress_StudentId",
                table: "studentQuranProgresses",
                newName: "IX_studentQuranProgresses_StudentId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_studentQuranProgresses",
                table: "studentQuranProgresses",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_studentQuranProgresses_Students_StudentId",
                table: "studentQuranProgresses",
                column: "StudentId",
                principalTable: "Students",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_studentQuranProgresses_Students_StudentId",
                table: "studentQuranProgresses");

            migrationBuilder.DropPrimaryKey(
                name: "PK_studentQuranProgresses",
                table: "studentQuranProgresses");

            migrationBuilder.RenameTable(
                name: "studentQuranProgresses",
                newName: "StudentQuranProgress");

            migrationBuilder.RenameIndex(
                name: "IX_studentQuranProgresses_StudentId",
                table: "StudentQuranProgress",
                newName: "IX_StudentQuranProgress_StudentId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_StudentQuranProgress",
                table: "StudentQuranProgress",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_StudentQuranProgress_Students_StudentId",
                table: "StudentQuranProgress",
                column: "StudentId",
                principalTable: "Students",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}

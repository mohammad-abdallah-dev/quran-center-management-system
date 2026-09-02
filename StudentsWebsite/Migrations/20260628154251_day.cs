using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StudentsWebsite.Migrations
{
    /// <inheritdoc />
    public partial class day : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<DateOnly>(
                name: "ProgressDate",
                table: "StudentDailyProgresses",
                type: "date",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.AddColumn<string>(
                name: "NextTask",
                table: "StudentDailyProgresses",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "NextTask",
                table: "StudentDailyProgresses");

            migrationBuilder.AlterColumn<DateTime>(
                name: "ProgressDate",
                table: "StudentDailyProgresses",
                type: "datetime2",
                nullable: false,
                oldClrType: typeof(DateOnly),
                oldType: "date");
        }
    }
}

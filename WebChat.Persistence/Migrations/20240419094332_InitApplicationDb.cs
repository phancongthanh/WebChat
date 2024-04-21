using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace WebChat.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class InitApplicationDb : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "Default");

            migrationBuilder.CreateTable(
                name: "Conversation",
                schema: "Default",
                columns: table => new
                {
                    ConversationId = table.Column<Guid>(type: "uuid", nullable: false),
                    Type = table.Column<int>(type: "integer", nullable: false),
                    Created = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    CreatedBy = table.Column<string>(type: "text", nullable: true),
                    LastModified = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    LastModifiedBy = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Conversation", x => x.ConversationId);
                });

            migrationBuilder.CreateTable(
                name: "Group",
                schema: "Default",
                columns: table => new
                {
                    GroupId = table.Column<Guid>(type: "uuid", nullable: false),
                    AvatarPath = table.Column<string>(type: "text", nullable: true),
                    Name = table.Column<string>(type: "text", nullable: false),
                    ConversationId = table.Column<Guid>(type: "uuid", nullable: false),
                    Created = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    CreatedBy = table.Column<string>(type: "text", nullable: true),
                    LastModified = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    LastModifiedBy = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Group", x => x.GroupId);
                    table.ForeignKey(
                        name: "FK_Group_Conversation_ConversationId",
                        column: x => x.ConversationId,
                        principalSchema: "Default",
                        principalTable: "Conversation",
                        principalColumn: "ConversationId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "User",
                schema: "Default",
                columns: table => new
                {
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    AvatarPath = table.Column<string>(type: "text", nullable: true),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Birthday = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Gender = table.Column<int>(type: "integer", nullable: false),
                    PhoneNumber_CountryCode = table.Column<string>(type: "text", nullable: false),
                    PhoneNumber_SubscriberNumber = table.Column<string>(type: "text", nullable: false),
                    ConversationId = table.Column<Guid>(type: "uuid", nullable: false),
                    Created = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    CreatedBy = table.Column<string>(type: "text", nullable: true),
                    LastModified = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    LastModifiedBy = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_User", x => x.UserId);
                    table.ForeignKey(
                        name: "FK_User_Conversation_ConversationId",
                        column: x => x.ConversationId,
                        principalSchema: "Default",
                        principalTable: "Conversation",
                        principalColumn: "ConversationId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "GroupSetting",
                schema: "Default",
                columns: table => new
                {
                    GroupId = table.Column<Guid>(type: "uuid", nullable: false),
                    AllowChangeGName = table.Column<bool>(type: "boolean", nullable: false),
                    AllowSendGInvitation = table.Column<bool>(type: "boolean", nullable: false),
                    MembershipApproval = table.Column<bool>(type: "boolean", nullable: false),
                    ReadRecentMessage = table.Column<bool>(type: "boolean", nullable: false),
                    JoinGroupByLink = table.Column<bool>(type: "boolean", nullable: false),
                    GroupCode = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GroupSetting", x => x.GroupId);
                    table.ForeignKey(
                        name: "FK_GroupSetting_Group_GroupId",
                        column: x => x.GroupId,
                        principalSchema: "Default",
                        principalTable: "Group",
                        principalColumn: "GroupId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ConversationMember",
                schema: "Default",
                columns: table => new
                {
                    ConversationId = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    IsHidden = table.Column<bool>(type: "boolean", nullable: false),
                    ReceivedToId = table.Column<long>(type: "bigint", nullable: false),
                    SeenToId = table.Column<long>(type: "bigint", nullable: false),
                    LoadFromId = table.Column<long>(type: "bigint", nullable: false),
                    HiddenMessageIds = table.Column<long[]>(type: "bigint[]", nullable: false),
                    IsBlock = table.Column<bool>(type: "boolean", nullable: false),
                    Created = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    CreatedBy = table.Column<string>(type: "text", nullable: true),
                    LastModified = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    LastModifiedBy = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ConversationMember", x => new { x.ConversationId, x.UserId });
                    table.ForeignKey(
                        name: "FK_ConversationMember_Conversation_ConversationId",
                        column: x => x.ConversationId,
                        principalSchema: "Default",
                        principalTable: "Conversation",
                        principalColumn: "ConversationId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ConversationMember_User_UserId",
                        column: x => x.UserId,
                        principalSchema: "Default",
                        principalTable: "User",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Friendship",
                schema: "Default",
                columns: table => new
                {
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    FriendId = table.Column<Guid>(type: "uuid", nullable: false),
                    FriendAlias = table.Column<string>(type: "text", nullable: true),
                    FriendPhone_CountryCode = table.Column<string>(type: "text", nullable: true),
                    FriendPhone_SubscriberNumber = table.Column<string>(type: "text", nullable: true),
                    Blocked = table.Column<bool>(type: "boolean", nullable: false),
                    Request_Title = table.Column<string>(type: "text", nullable: true),
                    Request_Description = table.Column<string>(type: "text", nullable: true),
                    Request_SendTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    IsFriend = table.Column<bool>(type: "boolean", nullable: false),
                    ConversationId = table.Column<Guid>(type: "uuid", nullable: false),
                    Created = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    CreatedBy = table.Column<string>(type: "text", nullable: true),
                    LastModified = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    LastModifiedBy = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Friendship", x => new { x.UserId, x.FriendId });
                    table.ForeignKey(
                        name: "FK_Friendship_Conversation_ConversationId",
                        column: x => x.ConversationId,
                        principalSchema: "Default",
                        principalTable: "Conversation",
                        principalColumn: "ConversationId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Friendship_User_FriendId",
                        column: x => x.FriendId,
                        principalSchema: "Default",
                        principalTable: "User",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Friendship_User_UserId",
                        column: x => x.UserId,
                        principalSchema: "Default",
                        principalTable: "User",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "GroupMember",
                schema: "Default",
                columns: table => new
                {
                    GroupId = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    Role = table.Column<int>(type: "integer", nullable: false),
                    JoinDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    JoinBy = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GroupMember", x => new { x.GroupId, x.UserId });
                    table.ForeignKey(
                        name: "FK_GroupMember_Group_GroupId",
                        column: x => x.GroupId,
                        principalSchema: "Default",
                        principalTable: "Group",
                        principalColumn: "GroupId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_GroupMember_User_UserId",
                        column: x => x.UserId,
                        principalSchema: "Default",
                        principalTable: "User",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "JoinInvitation",
                schema: "Default",
                columns: table => new
                {
                    GroupId = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    MemberId = table.Column<Guid>(type: "uuid", nullable: false),
                    SendTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_JoinInvitation", x => new { x.GroupId, x.UserId });
                    table.ForeignKey(
                        name: "FK_JoinInvitation_Group_GroupId",
                        column: x => x.GroupId,
                        principalSchema: "Default",
                        principalTable: "Group",
                        principalColumn: "GroupId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_JoinInvitation_User_UserId",
                        column: x => x.UserId,
                        principalSchema: "Default",
                        principalTable: "User",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "JoinRequest",
                schema: "Default",
                columns: table => new
                {
                    GroupId = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    SendTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_JoinRequest", x => new { x.GroupId, x.UserId });
                    table.ForeignKey(
                        name: "FK_JoinRequest_Group_GroupId",
                        column: x => x.GroupId,
                        principalSchema: "Default",
                        principalTable: "Group",
                        principalColumn: "GroupId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_JoinRequest_User_UserId",
                        column: x => x.UserId,
                        principalSchema: "Default",
                        principalTable: "User",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Message",
                schema: "Default",
                columns: table => new
                {
                    MessageId = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ConversationId = table.Column<Guid>(type: "uuid", nullable: false),
                    FromUserId = table.Column<Guid>(type: "uuid", nullable: false),
                    SendTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Text = table.Column<string>(type: "text", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    Created = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    CreatedBy = table.Column<string>(type: "text", nullable: true),
                    LastModified = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    LastModifiedBy = table.Column<string>(type: "text", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Message", x => x.MessageId);
                    table.ForeignKey(
                        name: "FK_Message_Conversation_ConversationId",
                        column: x => x.ConversationId,
                        principalSchema: "Default",
                        principalTable: "Conversation",
                        principalColumn: "ConversationId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Message_User_FromUserId",
                        column: x => x.FromUserId,
                        principalSchema: "Default",
                        principalTable: "User",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "FileMetadata",
                schema: "Default",
                columns: table => new
                {
                    Path = table.Column<string>(type: "text", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Size = table.Column<long>(type: "bigint", nullable: false),
                    ContentType = table.Column<string>(type: "text", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    MessageId = table.Column<long>(type: "bigint", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FileMetadata", x => x.Path);
                    table.ForeignKey(
                        name: "FK_FileMetadata_Message_MessageId",
                        column: x => x.MessageId,
                        principalSchema: "Default",
                        principalTable: "Message",
                        principalColumn: "MessageId");
                });

            migrationBuilder.CreateIndex(
                name: "IX_ConversationMember_UserId",
                schema: "Default",
                table: "ConversationMember",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_FileMetadata_MessageId",
                schema: "Default",
                table: "FileMetadata",
                column: "MessageId");

            migrationBuilder.CreateIndex(
                name: "IX_Friendship_ConversationId",
                schema: "Default",
                table: "Friendship",
                column: "ConversationId");

            migrationBuilder.CreateIndex(
                name: "IX_Friendship_FriendId",
                schema: "Default",
                table: "Friendship",
                column: "FriendId");

            migrationBuilder.CreateIndex(
                name: "IX_Friendship_UserId",
                schema: "Default",
                table: "Friendship",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Group_ConversationId",
                schema: "Default",
                table: "Group",
                column: "ConversationId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_GroupMember_UserId",
                schema: "Default",
                table: "GroupMember",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_GroupSetting_GroupCode",
                schema: "Default",
                table: "GroupSetting",
                column: "GroupCode");

            migrationBuilder.CreateIndex(
                name: "IX_JoinInvitation_UserId",
                schema: "Default",
                table: "JoinInvitation",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_JoinRequest_UserId",
                schema: "Default",
                table: "JoinRequest",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Message_ConversationId",
                schema: "Default",
                table: "Message",
                column: "ConversationId");

            migrationBuilder.CreateIndex(
                name: "IX_Message_ConversationId_MessageId",
                schema: "Default",
                table: "Message",
                columns: new[] { "ConversationId", "MessageId" });

            migrationBuilder.CreateIndex(
                name: "IX_Message_FromUserId",
                schema: "Default",
                table: "Message",
                column: "FromUserId");

            migrationBuilder.CreateIndex(
                name: "IX_User_ConversationId",
                schema: "Default",
                table: "User",
                column: "ConversationId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ConversationMember",
                schema: "Default");

            migrationBuilder.DropTable(
                name: "FileMetadata",
                schema: "Default");

            migrationBuilder.DropTable(
                name: "Friendship",
                schema: "Default");

            migrationBuilder.DropTable(
                name: "GroupMember",
                schema: "Default");

            migrationBuilder.DropTable(
                name: "GroupSetting",
                schema: "Default");

            migrationBuilder.DropTable(
                name: "JoinInvitation",
                schema: "Default");

            migrationBuilder.DropTable(
                name: "JoinRequest",
                schema: "Default");

            migrationBuilder.DropTable(
                name: "Message",
                schema: "Default");

            migrationBuilder.DropTable(
                name: "Group",
                schema: "Default");

            migrationBuilder.DropTable(
                name: "User",
                schema: "Default");

            migrationBuilder.DropTable(
                name: "Conversation",
                schema: "Default");
        }
    }
}

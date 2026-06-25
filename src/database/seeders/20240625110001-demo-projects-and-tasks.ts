import { QueryInterface } from "sequelize";

const ADMIN_ID = "a0000000-0000-4000-8000-000000000001";
const MEMBER_ONE_ID = "a0000000-0000-4000-8000-000000000002";
const MEMBER_TWO_ID = "a0000000-0000-4000-8000-000000000003";

const PROJECT_ONE_ID = "b0000000-0000-4000-8000-000000000001";
const PROJECT_TWO_ID = "b0000000-0000-4000-8000-000000000002";

const TASK_ONE_ID = "c0000000-0000-4000-8000-000000000001";
const TASK_TWO_ID = "c0000000-0000-4000-8000-000000000002";
const TASK_THREE_ID = "c0000000-0000-4000-8000-000000000003";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface: QueryInterface) {
    const now = new Date();
    const nextWeek = new Date(now);
    nextWeek.setDate(nextWeek.getDate() + 7);
    const nextMonth = new Date(now);
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    await queryInterface.bulkInsert("projects", [
      {
        id: PROJECT_ONE_ID,
        createdBy: ADMIN_ID,
        title: "Website Redesign",
        description: "Redesign the company website with a modern UI and improved performance.",
        status: "in_progress",
        isDeleted: false,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: PROJECT_TWO_ID,
        createdBy: ADMIN_ID,
        title: "Mobile App MVP",
        description: "Build the first version of the mobile application for iOS and Android.",
        status: "pending",
        isDeleted: false,
        createdAt: now,
        updatedAt: now,
      },
    ]);

    await queryInterface.bulkInsert("tasks", [
      {
        id: TASK_ONE_ID,
        projectId: PROJECT_ONE_ID,
        createdBy: ADMIN_ID,
        assignedTo: MEMBER_ONE_ID,
        title: "Create wireframes",
        description: "Design low-fidelity wireframes for all main pages.",
        status: "done",
        priority: "high",
        dueDate: now,
        isDeleted: false,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: TASK_TWO_ID,
        projectId: PROJECT_ONE_ID,
        createdBy: ADMIN_ID,
        assignedTo: MEMBER_TWO_ID,
        title: "Implement homepage",
        description: "Build the responsive homepage based on approved designs.",
        status: "in_progress",
        priority: "medium",
        dueDate: nextWeek,
        isDeleted: false,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: TASK_THREE_ID,
        projectId: PROJECT_TWO_ID,
        createdBy: ADMIN_ID,
        assignedTo: MEMBER_ONE_ID,
        title: "Define API requirements",
        description: "Document the REST API endpoints needed for the mobile app.",
        status: "pending",
        priority: "low",
        dueDate: nextMonth,
        isDeleted: false,
        createdAt: now,
        updatedAt: now,
      },
    ]);
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.bulkDelete("tasks", {
      id: [TASK_ONE_ID, TASK_TWO_ID, TASK_THREE_ID],
    });
    await queryInterface.bulkDelete("projects", {
      id: [PROJECT_ONE_ID, PROJECT_TWO_ID],
    });
  },
};

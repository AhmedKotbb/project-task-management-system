import { QueryInterface, DataTypes } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.createTable("tasks", {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      projectId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "projects",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      createdBy: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      assignedTo: {
        type: DataTypes.UUID,
        allowNull: true,
        defaultValue: null,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("pending", "in_progress", "done"),
        allowNull: false,
        defaultValue: "pending",
      },
      priority: {
        type: DataTypes.ENUM("low", "medium", "high"),
        allowNull: false,
        defaultValue: "medium",
      },
      dueDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      isDeleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    });

    await queryInterface.addIndex("tasks", ["projectId", "title"], {
      unique: true,
      name: "tasks_project_id_title_unique",
    });
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.removeIndex("tasks", "tasks_project_id_title_unique");
    await queryInterface.dropTable("tasks");
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_tasks_status";',
    );
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_tasks_priority";',
    );
  },
};

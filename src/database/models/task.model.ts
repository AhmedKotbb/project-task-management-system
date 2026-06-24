import { DataTypes, Model, Sequelize } from "sequelize";

export class Task extends Model {
  static initialize(sequelize: Sequelize) {
    Task.init(
      {
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
        },
        createdBy: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: "users",
            key: "id",
          },
        },
        assignedTo: {
          type: DataTypes.UUID,
          allowNull: true,
          defaultValue: null,
          references: {
            model: "users",
            key: "id",
          },
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
          type: DataTypes.ENUM('pending', 'in_progress', 'done'),
          allowNull: false,
          defaultValue: 'pending',
        },
        priority: {
          type: DataTypes.ENUM('low', 'medium', 'high'),
          allowNull: false,
          defaultValue: 'medium',
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
      },
      {
        sequelize,
        tableName: 'tasks',
        timestamps: true,
        indexes: [
          {
            unique: true,
            fields: ['projectId', 'title'],
          },
        ],
      }
    )
  }
}
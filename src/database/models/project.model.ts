import { DataTypes, Model, Sequelize } from "sequelize";

export class Project extends Model {
  static initialize(sequelize: Sequelize) {
    Project.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        createdBy: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: "users",
            key: "id",
          },
        },
        title: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        status: {
          type: DataTypes.ENUM('pending', 'in_progress', 'completed'),
          allowNull: false,
          defaultValue: 'pending',
        },
        isDeleted: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
          allowNull: false,
        }
      },
      {
        sequelize,
        tableName: "projects",
        timestamps: true,
      }
    )
  }
}
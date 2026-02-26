import { DataTypes, Model } from "sequelize";

export class Incident extends Model {
    public id!: number;
    public title!: string;
    public description!: string;
    public category!: string;
    public priority!: string;
    public status!: string;
    public resolutionNotes!: string | null;
    public imageUrl!: string | null;
    public storeId!: number;
    public reportedById!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    static associate(models: any) {
        Incident.belongsTo(models.Store, {
            foreignKey: "storeId",
            as: "store",
        });

        Incident.belongsTo(models.User, {
            foreignKey: "reportedById",
            as: "reportedBy",
        });
    }

    static initModel(sequelize: any) {
        Incident.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    autoIncrement: true,
                    primaryKey: true,
                },
                title: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                description: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                },
                category: {
                    type: DataTypes.ENUM("maintenance", "inventory", "hr", "operations", "suggestion"),
                    allowNull: false,
                    defaultValue: "operations",
                },
                priority: {
                    type: DataTypes.ENUM("low", "medium", "high", "urgent"),
                    allowNull: false,
                    defaultValue: "medium",
                },
                status: {
                    type: DataTypes.ENUM("pending", "in_progress", "resolved", "rejected"),
                    allowNull: false,
                    defaultValue: "pending",
                },
                resolutionNotes: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                imageUrl: {
                    type: DataTypes.STRING,
                    allowNull: true,
                },
                storeId: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    field: "store_id",
                    references: {
                        model: "stores",
                        key: "id",
                    },
                },
                reportedById: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    field: "reported_by_id",
                    references: {
                        model: "users",
                        key: "id",
                    },
                },
            },
            {
                sequelize,
                tableName: "incidents",
                timestamps: true,
            }
        );
    }
}

export default Incident;

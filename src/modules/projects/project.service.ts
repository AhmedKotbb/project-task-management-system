import { Op, WhereOptions } from "sequelize";
import { Project } from "../../database/models/project.model";
import { APIError } from "../../shared/errors";
import { TokenPayload } from "../auth/auth.interfaces";
import { CreateProjectDto, UpdateProjectDto } from "./project.dtos";
import { User } from "../../database/models/user.model";

class ProjectService {

  public async createNewProject(dto: CreateProjectDto, user: TokenPayload) {
    const existingProject = await Project.findOne({
      where: {
        title: dto.title,
      },
    });
    if (existingProject) {
      throw APIError.BadRequest("Project with this title already exists");
    }
    const project = await Project.create({
      title: dto.title,
      description: dto.description,
      createdBy: user.id,
    });
    return project;
  }

  public async listAllProjects(query: any) {
    const { page, limit = 10, sortBy = 'createdAt', sort = 'desc', search } = query;
    const offset = (+page - 1) * limit;

    const where: WhereOptions = {
      isDeleted: false,
      ...(search && {
        [Op.or]: [
          { title: { [Op.iLike]: `%${search}%` } },
        ],
      }),
    };

    const { count, rows } = await Project.findAndCountAll({
      where,
      attributes: { exclude: ['createdBy'] },
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'fullName', 'email', 'phoneNumber'],
        }
      ],
      order: [[sortBy, sort]],
      limit,
      offset,
    });

    return {
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: +page,
      rows: rows,
    }
  }

  public async updateProject(dto: UpdateProjectDto){
    const { id, title, status, description } = dto;
    const [project, existingTitle] = await Promise.all([
      Project.findByPk(dto.id),
      Project.findOne({
        where: {
          title: title,
          id: { [Op.ne]: id },
        },
      }),
    ])

    if(!project) {
      throw APIError.NotFound("Project not found");
    }

    if(title && existingTitle) {
      throw APIError.BadRequest("Project with this title already exists");
    }

    if(status && status === 'completed' && project.dataValues.status === 'pending') {
      throw APIError.BadRequest("Cannot mark a pending project as completed");
    }

    const updates: any = {
      ...(title && { title }),
      ...(description && { description }),
      ...(status && { status }),
    }

    return await project.update(updates);

  }

  public async deleteProject(id: string){
    const project = await Project.findByPk(id);
    if(!project) {
      throw APIError.NotFound("Project not found");
    }
    if(project.dataValues.isDeleted) {
      throw APIError.BadRequest("Project is already deleted");
    }
    await project.update({ isDeleted: true });
  }

  public async getProjectDetails(id: string){
    const project = await Project.findByPk(id, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'fullName', 'email', 'phoneNumber'],
        }
      ]
    });
    if(!project) {
      throw APIError.NotFound("Project not found");
    }
    return project;
  }
}

export default ProjectService;
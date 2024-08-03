import { catchAsyncErrors } from '../middlewares/catchAsyncErrors.js'
import ErrorHandler from '../middlewares/error.js'
import { Project } from '../modals/projectSchema.model.js'
import { v2 as cloudinary } from 'cloudinary'
export const addNewProject = catchAsyncErrors(async (req, res, next) => {
  const {
    title,
    description,
    gitRepoLink,
    projectLink,
    technologies,
    stack,
    deployed,
  } = req.body

  if (
    !title ||
    !description ||
    !gitRepoLink ||
    !projectLink ||
    !technologies ||
    !stack ||
    !deployed
  ) {
    return next(new ErrorHandler('Please provide all Details', 400))
  }
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler('Project banner image required', 400))
  }

  const { projectBanner } = req.files

  const cloudinaryResponse = await cloudinary.uploader.upload(
    projectBanner.tempFilePath,
    { folder: 'PROJECT IMAGES' }
  )
  if (!cloudinaryResponse || cloudinaryResponse.error) {
    console.error(
      'Cloudinary Error:',
      cloudinaryResponse.error || 'Unknown Cloudinary Error!'
    )
    return next(
      new ErrorHandler('Failed to upload project banner to cloudinary', 500)
    )
  }

  const data = await Project.create({
    title,
    description,
    gitRepoLink,
    projectLink,
    technologies,
    stack,
    deployed,
    projectBanner: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    },
  })

  res.status(201).json({
    success: true,
    message: 'New project added!',
    data,
  })
})

export const deleteProject = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params

  const project = await Project.findById(id)
  if (!project) {
    return next(new ErrorHandler('Project not found', 404))
  }

  const projectBannerSvgId = project.projectBanner.public_id
  await cloudinary.uploader.destroy(projectBannerSvgId)
  await project.deleteOne()
  res.status(200).json({
    success: true,
    message: 'Project deleted!',
  })
})

export const updateProject = catchAsyncErrors(async (req, res, next) => {
  const newProjectData = {
    title: req.body.title,
    description: req.body.description,
    gitRepoLink: req.body.gitRepoLink,
    projectLink: req.body.projectLink,
    technologies: req.body.technologies,
    stack: req.body.stack,
    deployed: req.body.deployed,
  }
  if (req.files && req.files.projectBanner) {
    const projectBanner = req.files.projectBanner
    const project = await Project.findById(req.params.id)
    const projectBannerId = project.projectBanner.public_id
    await cloudinary.uploader.destroy(projectBannerId)
    const cloudinaryResponse = await cloudinary.uploader.upload(
      projectBanner.tempFilePath,
      { folder: 'PROJECT IMAGES' }
    )
    newProjectData.projectBanner = {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    }
  }

  const data = await Project.findByIdAndUpdate(req.params.id, newProjectData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  })

  res.status(200).json({
    success: true,
    message: 'Project updated successfully!',
    data,
  })
})
export const getAllProject = catchAsyncErrors(async (req, res, next) => {
  const data = await Project.find()
  res.status(200).json({
    success: true,
    data,
  })
})
export const getSingleProject = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params
  const data = await Project.findById(id)
  if (!data) {
    return next(new ErrorHandler('Project not found!', 404))
  }
  res.status(200).json({
    success: true,
    data,
  })
})

#' Creates project to be distributed via Docker
#'
#' @param title title of the project
#' @param project.path full path to the projects folder. Final project folder will be \code{project.path / title}
#'  
#' @return nothing
#'
create_project <- function(title, project.path = getwd()) {
  
  project.path <- paste(project.path, title, sep = "/")
  
  # Creates project folder
  if (!file.exists(project.path)) {
    result <- dir.create(project.path, showWarnings = FALSE, recursive = TRUE)
    if (!result) {
      stop(sprintf("Failed to create project at '%s'!", project.path))
    }
  } else {
    stop("Project folder already exists!")
  }
  
  # Creates signature file
  con <- file(paste(project.path, ".info_rdocker", sep = "/"), open = "w")
  writeLines(title, con = con)
  close(con)
  
  # Initializes packrat
  local_repos <- .libPaths()[1]
  packrat::init(project.path, restart = FALSE)
  packrat::set_opts(local.repos = local_repos, external.packages = "rdocker")
  packrat::install_local(c("packrat"))
  
  cat("Done.")
  invisible(NULL)
}


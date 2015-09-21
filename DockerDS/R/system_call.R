system_call <- function (cmd) {
  # Makes system call & returns accurate status
  #
  # Args:
  #  cmd: command to be executed
  #
  # Returns:
  #  List with three components:
  #  - exit status  
  #  - stdout
  #  - stderr
  
  stderrFile <- tempfile(pattern = "DockerDS_system_call_stderr", fileext = as.character(Sys.getpid()))
  stdoutFile <- tempfile(pattern = "DockerDS_system_call_stdout", fileext = as.character(Sys.getpid()))
  
  retval <- list()
  retval$exitStatus <- system(paste0(cmd, " 2> ", shQuote(stderrFile), " > ", shQuote(stdoutFile)))
  retval$stdout <- readLines(stdoutFile)
  retval$stderr <- readLines(stderrFile)
  
  unlink(c(stdoutFile, stderrFile))
  
  # Robust results
  if (retval$exitStatus == 0) {
    return(retval$stdout)
  } else {
    warning(retval$stderr)
    return(NULL)
  }
}



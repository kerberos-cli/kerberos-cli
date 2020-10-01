// commands
// --------

// command ls
export const COMMAND__LS__DESC = 'show all project information'
export const COMMAND__LS__OPTIONS_PROJECT = 'specify the project to show information'
export const COMMAND__LS__OPTIONS_DEPENDENCIES = 'show the list of dependencies'
export const COMMAND__LS__WARNING_CIRCULAR_MESSAGE = 'There are circular references between projects.'

// command install
export const COMMAND__INSTALL__DESC = 'initialize the workspace with configuration project'
export const COMMAND__INSTALL__CONFIRM_MOVE_FILES = 'This action will move your files, are you sure you want to perform this action?'
export const COMMAND__INSTALL__ERROR_SOFT_LINK = 'The file #{1} is a soft link and cannot be installed.'
export const COMMAND__INSTALL__ERROR_NO_PACKAGE = 'The file package.json is not found.'
export const COMMAND__INSTALL__ERROR_NO_SETTINGS = 'The settings of this project could not be found in the #{1}.'
export const COMMAND__INSTALL__ERROR_INVALID_SETTINGS = 'Workspace configuration setting error in the #{1}.'

// command it
export const COMMAND__IT__DESC = 'select an project to input the commands'
export const COMMAND__IT__OPTION_PROJECT = 'specify the project to input the commands'
export const COMMAND__IT__SELECT_PROJECT = 'Please select the project to be executed.'
export const COMMAND__IT__ERROR_FOLDER_NOT_FOUND = 'Not a kerberos project (or not added to the kerberos.json file).'
export const COMMAND__IT__ERROR_COMMAND_NOT_FOUND = 'Command #1 is not found.'
export const COMMAND__IT__HELP_EXIT = 'Press `Ctrl+C` or type `exit` to exit.'

// command init
export const COMMAND__INIT__DESC = 'initalize kerberos workspace'
export const COMMAND__INIT__CONFIRM_CLEAN_MESSAGE = 'Folder is not empty, can I clean it up for you?'
export const COMMAND__INIT__CONFIRM_CREATE_CONFIG_PROJECT = 'Can I create a new kerberos configuration project?'
export const COMMAND__INIT__ERROR_INVALID_FOLDER = 'File is not a directory.'
export const COMMAND__INIT__ERROR_EMPTY_FOLDER = 'Folder is not empty.'
export const COMMAND__INIT__ERROR_INVALID_REPO = 'Repo is invalid.'
export const COMMAND__INIT__ERROR_FAIL_CLONE = 'Git clone failed.'
export const COMMAND__INIT__ERROR_NOT_FOUND_CONFIG_FILE = 'Can not found kerberos.json file.'
export const COMMAND__INIT__SUCCESS_INIT_GIT = 'The generation of the kerberos configuration project has been completed.'
export const COMMAND__INIT__SUCCESS_COMPLETE = 'The initial setup of the kerberos workspace has been completed.'
export const COMMAND__INIT__HELP_OPERATION = 'Type <cd #{1}> and enter the workspace.'

// command exec
export const COMMAND__EXEC__DESC = 'execute commands in the project'
export const COMMAND__EXEC__OPTION_PROJECT = 'specify the project to execute command'
export const COMMAND__EXEC__SELECT_PROJECT = 'Please select the project to be executed.'
export const COMMAND__EXEC__ERROR_NOT_FOUND_COMMAND = 'Command #{1} not found.'

// command exec-multi
export const COMMAND__EXEC_MULTI__DESC = 'execute command in multiple projects'
export const COMMAND__EXEC_MULTI__OPTION_PROJECT = 'specify multiple projects to excute command'
export const COMMAND__EXEC_MULTI__SELECT_PROJECT = 'Please select a project to run the script.'
export const COMMAND__EXEC_MULTI__ERROR_NOT_FOUND_COMMAND = 'Command #{1} not found.'

// command clone
export const COMMAND__CLONE__DESC = 'clone the git repository to the workspace'
export const COMMAND__CLONE__OPTION_WORKSPACE = 'specify the workspace of git clone'
export const COMMAND__CLONE__OPTION_OPTIONAL = 'specify the repository as selective installation'
export const COMMAND__CLONE__SELECT_WORKSPACE = 'Please select a workspace to clone the repository.'
export const COMMAND__CLONE__ERROR_INVALID_REPO = 'Repo is not a valid git url.'
export const COMMAND__CLONE__ERROR_EXISTS_PROJECT = 'There is a project with the same name already exists.'
export const COMMAND__CLONE__ERROR_FAILE_CLONE = 'Git clone error.'
export const COMMAND__CLONE__ERROR_INVALID_NODE_PROJECT = 'Repository is not a nodejs project.'
export const COMMAND__CLONE__ERROR_INVALID_PROJECT_NAME = 'Pacakge name is invalid.'
export const COMMAND__CLONE__SUCCESS_COMPLETE = 'Git clone project completed.'

// command checkout
export const COMMAND__CHECKOUT__DESC = 'check out the branch in the package'
export const COMMAND__CHECKOUT__OPTION_BRANCH = 'specify the branch to switch'
export const COMMAND__CHECKOUT__OPTION_PROJECT = 'specify the project to switch'
export const COMMAND__CHECKOUT__SELECT_PROJECT = 'Please select the project to checkout branch.'
export const COMMAND__CHECKOUT__SELECT_BRANCH = 'Please select the branch to checkout branch.'
export const COMMAND__CHECKOUT__SUCCESS_COMPLETE = 'Project #{1} has been change branch to #{2}.'

// command branch
export const COMMAND__BRANCH__DESC = 'show all branches of the project (local and remote)'
export const COMMAND__BRANCH__OPTION_PROJECT = 'specify the project to display the branch'
export const COMMAND__BRANCH__SELECT_PROJECT = 'Please select the project to view the branch.'

// command bootstrap
export const COMMAND__BOOTSTRAP__DESC = 'initialize yarn workspace and install depedencies of all projects'
export const COMMAND__BOOTSTRAP__OPTION_YES = 'skip all questions'
export const COMMAND__BOOTSTRAP__OPTION_OPTIONAL = 'specify to install all optional dependencies when specifying the --yes option'
export const COMMAND__BOOTSTRAP__SELECT_CLONE_PROJECT = 'Please select the project to clone.'
export const COMMAND__BOOTSTRAP__CONFIRM_INSTALL_OPTIONAL = 'It was found that some optional items were not installed. Do I need to install these items?'
export const COMMAND__BOOTSTRAP__CONFIRM_INSTALL_DEPEDENCIES = 'Do you need to install dependencies.'
export const COMMAND__BOOTSTRAP__ERROR_INVALID_PACKAGE = 'Package.json is invalid.'
export const COMMAND__BOOTSTRAP__SUCCESS_COMPLETE = 'Bootstrap has been completed.'

// command support
export const COMMAND__SUPPORT__DESC = 'determine whether all dependencies have been installed'
export const COMMAND__SUPPORT__ERROR_INSTALL_FIRST = 'Please install #{1} first.'
export const COMMAND__SUPPORT__SUCCESS = 'All dependencies are ready, you can use kerberos normally.'

// command run
export const COMMAND__RUN__DESC = 'execute script in project'
export const COMMAND__RUN__OPTION_PROJECT = 'specify the project to run npm-scripts'
export const COMMAND__RUN__SELECT_PROJECT = 'Please select the project to be executed.'
export const COMMAND__RUN__SELECT_SCRIPT = 'Please select a script to run.'

// command run-multi
export const COMMAND__RUN_MULTI__DESC = 'execute script in multiple projects'
export const COMMAND__RUN_MULTI__SELECT_PROJECT = 'Please select a project to run the script.'
export const COMMAND__RUN_MULTI__WARN_NOT_FOUND_PROJECT = 'Script #{1} not found in project #{2}.'

// command/share
// -------------

// tryGetBranch
export const COMMAND_SHARE__TRY_GET_BRANCH__SELECT_BRANCH = '#{1} (Cur Branch: #{2})'
export const COMMAND_SHARE__TRY_GET_BRANCH__ERROR_NOT_FOUND_BRANCH = 'Branch #{1} not found.'

// tryGetProject
export const COMMAND_SHARE__TRY_GET_PROJECT__ERROR_NOT_FOUND_BRANCH = 'Project #{1} not found.'

// tryGetProjects
export const COMMAND_SHARE__TRY_GET_PROJECTS__ERROR_NO_MATCH_PROJECTS = 'No projects match.'

// tryGetScript
export const COMMAND_SHARE__TRY_GET_SCRIPT__ERROR_NOT_FOUND_SCRIPT = 'Script #{1} not found.'

// tryGetWorkspace
export const COMMAND_SHARE__TRY_GET_WORKSPACE__ERROR_NOT_FOUND_PROJECT = 'Project #{1} not found.'

// interceptors
// ------------

// context
export const INTERCEPTORS__CONTEXT__ERROR_INVALID_PROJECT = 'Not a kerberos workspace (or any of the parent directories).'

// supported
export const INTERCEPTORS__SUPPORTED__ERROR_NOT_INSTALL_GIT = 'Git is not supported, please install Git first.'
export const INTERCEPTORS__SUPPORTED__ERROR_NOT_INSTALL_YARN = 'Yarn is not supported, please enter `npm i -g yarn` first.'

// ui
// ------------

export const UI_SELECT_OPTIONS__WORKSPACE__WARN_NOT_FOUND_WORKSPACE = 'No workspace found.'
export const UI_SELECT_OPTIONS__PROJECT__WARN_NOT_FOUND_PROJECT = 'No project found.'
export const UI_SELECT_OPTIONS__BRANCH__WARN_NOT_FOUND_BRANCH = 'No branches found.'
export const UI_SELECT_OPTIONS__PROJECT_IN_CONFIG__WARN_NOT_FOUND_PROJECTS = 'No projects found in #{1}.'

export const UI__GSEL__ERROR_NOT_FOUND_SELECTOR = 'Selector #{1} not found.'
export const UI__G_MULTI_SEL__ERROR_NOT_FOUND_SELECTOR = 'Selector #{1} not found.'
export const UI__CONFIRM__DEFAULT_MESSAGE = 'Are you sure?'
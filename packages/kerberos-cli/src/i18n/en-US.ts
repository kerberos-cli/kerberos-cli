// commands
// --------

export const alias = 'English'

// options
export const COMMAND__OPTION__VERSION_DESC = 'show Kerberos version'
export const COMMAND__OPTION__HELP_DESC = 'show more Kerberos cli information'
export const COMMAND__OPTION__VERBOSE = 'show execution details'

// command help
export const COMMAND__HELP__DESC = 'display help for command'

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

// command bootstrap
export const COMMAND__BOOTSTRAP__DESC = 'initialize yarn workspace and install depedencies of all projects'
export const COMMAND__BOOTSTRAP__OPTION_YES = 'skip all questions'
export const COMMAND__BOOTSTRAP__OPTION_OPTIONAL = 'specify to install all optional dependencies when specifying the --yes option'
export const COMMAND__BOOTSTRAP__SELECT_CLONE_PROJECT = 'Please select the project to clone.'
export const COMMAND__BOOTSTRAP__CONFIRM_INSTALL_OPTIONAL = 'It was found that some optional items were not installed. Do I need to install these items?'
export const COMMAND__BOOTSTRAP__CONFIRM_INSTALL_DEPEDENCIES = 'Do you need to install dependencies.'
export const COMMAND__BOOTSTRAP__ERROR_INVALID_PACKAGE = 'Package.json is invalid.'
export const COMMAND__BOOTSTRAP__SUCCESS_COMPLETE = 'Bootstrap has been completed.'

// command install
export const COMMAND__INSTALL__DESC = 'initialize the workspace with configuration project'
export const COMMAND__INSTALL__CONFIRM_MOVE_FILES = 'This action will move your files, are you sure you want to perform this action?'
export const COMMAND__INSTALL__ERROR_SOFT_LINK = 'The file #{1} is a soft link and cannot be installed.'
export const COMMAND__INSTALL__ERROR_NO_PACKAGE = 'The file package.json is not found.'
export const COMMAND__INSTALL__ERROR_NO_SETTINGS = 'The settings of this project could not be found in the #{1}.'
export const COMMAND__INSTALL__ERROR_INVALID_SETTINGS = 'Workspace configuration setting error in the #{1}.'

// command ls
export const COMMAND__LS__DESC = 'show all project information'
export const COMMAND__LS__OPTIONS_PROJECT = 'specify the project to show information'
export const COMMAND__LS__OPTIONS_DEPENDENCIES = 'show the list of dependencies'
export const COMMAND__LS__WARNING_CIRCULAR_MESSAGE = 'There are circular references between projects.'

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
export const COMMAND__CHECKOUT__OPTION_PROJECTS = 'specify the projects to switch'
export const COMMAND__CHECKOUT__SELECT_PROJECT = 'Please select the projects to switch branch.'
export const COMMAND__CHECKOUT__SELECT_BRANCH = 'Please select the branch to checkout branch.'
export const COMMAND__CHECKOUT__ERROR_NOT_SUBMIT = 'Some files in the projects are in temporary storage (not submitted), please submit first.\n#{1}'
export const COMMAND__CHECKOUT__ERROR_FAIL_CHECKOUT = 'Project #{1} failed to switch branches, please complete the switch manually.'
export const COMMAND__CHECKOUT__SUCCESS_COMPLETE = 'Projects have been change branch to #{1}.'

// command branch
export const COMMAND__BRANCH__DESC = 'show all branches of the project (local and remote)'
export const COMMAND__BRANCH__OPTION_PROJECT = 'specify the project to display the branch'
export const COMMAND__BRANCH__SELECT_PROJECT = 'Please select the project to view the branch.'

// command version
export const COMMAND__VERSION__DESC = 'update project version'
export const COMMAND__VERSION__OPTION_NO_PUSH = 'do not git push'
export const COMMAND__VERSION__SELECT_PROJECTS = 'Please select projects to tag.'
export const COMMAND__VERSION__CONFIRM_DIFF_BRANCHES = 'The project is in different branches, are you sure you want to continue?\n#{1}\n'
export const COMMAND__VERSION__ERROR_NOT_SUBMIT = 'Some files in the projects are in temporary storage (not submitted), please submit first.\n#{1}'
export const COMMAND__VERSION__INPUT_VERSION = 'Please type a new version.'
export const COMMAND__VERSION__ERROR_RELEASE_BRANCH =
  'Projects #{1} are not in the release branch #{2}, please switch all of it to the release branch before tagging; The release branch is defined by the configuration file.'
export const COMMAND__VERSION__WARN_NO_REMOTE = 'Project #{1} does not specify origin remote host, please manually push to the remote host.'
export const COMMAND__VERSION__WARN_NO_BRANCH = 'Project #{1} does not specify any branch, please manually push to the remote host.'

// command run
export const COMMAND__RUN__DESC = 'execute script in project'
export const COMMAND__RUN__OPTION_PROJECT = 'specify the project to run npm-scripts'
export const COMMAND__RUN__SELECT_PROJECT = 'Please select the project to be executed.'
export const COMMAND__RUN__SELECT_SCRIPT = 'Please select a script to run.'

// command run-multi
export const COMMAND__RUN_MULTI__DESC = 'run script in multiple projects'
export const COMMAND__RUN_MULTI__OPTION_PROJECT = 'specify projects to run script'
export const COMMAND__RUN_MULTI__OPTION_PARALLEL = 'execute scripts in parallel'
export const COMMAND__RUN_MULTI__SELECT_PROJECT = 'Please select the projects to run script.'
export const COMMAND__RUN_MULTI__WARN_NOT_FOUND_PROJECT = 'Script #{1} not found in project #{2}.'

// command exec
export const COMMAND__EXEC__DESC = 'execute commands in the project'
export const COMMAND__EXEC__OPTION_PROJECT = 'specify the project to execute command'
export const COMMAND__EXEC__SELECT_PROJECT = 'Please select the project to be executed.'
export const COMMAND__EXEC__ERROR_NOT_FOUND_COMMAND = 'Command #{1} not found.'

// command exec-multi
export const COMMAND__EXEC_MULTI__DESC = 'execute command in multiple projects'
export const COMMAND__EXEC_MULTI__OPTION_PROJECT = 'specify projects to excute command'
export const COMMAND__EXEC_MULTI__OPTION_PARALLEL = 'execute commands in parallel'
export const COMMAND__EXEC_MULTI__SELECT_PROJECT = 'Please select the projects to excute command.'
export const COMMAND__EXEC_MULTI__ERROR_NOT_FOUND_COMMAND = 'Command #{1} not found.'

// command run
export const COMMAND__SCRIPT__DESC = 'execute the script in the root directory of the workspace'
export const COMMAND__SCRIPT__SELECT_SCRIPT = 'Please select a script to run.'

// command it
export const COMMAND__IT__DESC = 'select an project to input the commands'
export const COMMAND__IT__OPTION_PROJECT = 'specify the project to input the commands'
export const COMMAND__IT__SELECT_PROJECT = 'Please select the project to be executed.'
export const COMMAND__IT__ERROR_FOLDER_NOT_FOUND = 'Not a kerberos project (or not added to the kerberos.json file).'
export const COMMAND__IT__ERROR_COMMAND_NOT_FOUND = 'Command #{1} is not found.'
export const COMMAND__IT__HELP_EXIT = 'Press `Ctrl+C` or type `exit` to exit.'

// command language
export const COMMAND__LANGUAGE__DESC = 'Specify CLI language'
export const COMMAND__LANGUAGE__SELECT_LANGUAGE = 'Please select language for CLI. (Cur Language: #{1})'
export const COMMAND__LANGUAGE__ERROR_NOT_EXISTS = 'Language #{1} is temporarily not supported.'
export const COMMAND__LANGUAGE__SUCCESS_MESSAGE = 'Specify language #{1} successfully.'

// command support
export const COMMAND__SUPPORT__DESC = 'determine whether all dependencies have been installed'
export const COMMAND__SUPPORT__ERROR_INSTALL_FIRST = 'Please install #{1} first.'
export const COMMAND__SUPPORT__SUCCESS = 'All dependencies are ready, you can use kerberos normally.'

// command/share
// -------------

// tryGetBranch
export const COMMAND_SHARE__TRY_GET_BRANCH__SELECT_BRANCH = '#{1} (Cur Branch: #{2})'
export const COMMAND_SHARE__TRY_GET_BRANCH__ERROR_NOT_FOUND_BRANCH = 'Branch #{1} not found.'

// tryGetLanguage
export const COMMAND_SHARE__TRY_GET_LANGUAGE__ERROR_NOT_FOUND_LANGUAGE = 'Language #{1} is temporarily not supported.'

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

export const UI__SELECT_VERSION__DEFAULT_MESSAGE = 'Please select new version'
export const UI__SELECT_VERSION__INPUT_CUSTOM_PRE_VERSION = 'Please type a custom prerelease version'
export const UI__SELECT_VERSION__INPUT_CUSTOM_VERSION = 'Please type a custom version'

export const UI__INPUT_VERSION__DEFAULT_MESSAGE = 'Please type new version'
export const UI__INPUT_VERSION__ERROR_INVALID_VERSION = 'Version #{1} is invalid, please confirm the version format; eg: `1.0.0-alpha.1`'

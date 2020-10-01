// commands
// --------

// command ls
export const COMMAND__LS__DESC = '显示所有工程信息'
export const COMMAND__LS__OPTIONS_PROJECT = '指定工程以显示信息'
export const COMMAND__LS__OPTIONS_DEPENDENCIES = '显示依赖关系列表'
export const COMMAND__LS__WARNING_CIRCULAR_MESSAGE = '工程之间存在循环引用。'

// command install
export const COMMAND__INSTALL__DESC = '使用配置工程初始化工作区'
export const COMMAND__INSTALL__CONFIRM_MOVE_FILES = '此操作将移动您的文件，确定要执行此操作吗？'
export const COMMAND__INSTALL__ERROR_SOFT_LINK = '文件#{1}是软链，无法安装。'
export const COMMAND__INSTALL__ERROR_NO_PACKAGE = '找不到 package.json 文件。'
export const COMMAND__INSTALL__ERROR_NO_SETTINGS = '在#{1}中找不到此工程的设置。'
export const COMMAND__INSTALL__ERROR_INVALID_SETTINGS = '#{1}中的工作区配置设置错误。'

// command it
export const COMMAND__IT__DESC = '选择一个工程以输入命令'
export const COMMAND__IT__OPTION_PROJECT = '指定工程以输入命令'
export const COMMAND__IT__SELECT_PROJECT = '请选择要执行的工程。'
export const COMMAND__IT__ERROR_FOLDER_NOT_FOUND = '不是 Kerberos 工程（或未添加到 kerberos.json 文件中）。'
export const COMMAND__IT__ERROR_COMMAND_NOT_FOUND = '找不到命令1。'
export const COMMAND__IT__HELP_EXIT = '按 `Ctrl + C` 或输入 `exit` 退出。'

// command init
export const COMMAND__INIT__DESC = '初始化 Kerberos 工作区'
export const COMMAND__INIT__CONFIRM_CLEAN_MESSAGE = '文件夹不为空，我可以帮您清理一下吗？'
export const COMMAND__INIT__CONFIRM_CREATE_CONFIG_PROJECT = '我可以创建一个新的Kerberos配置工程吗？'
export const COMMAND__INIT__ERROR_INVALID_FOLDER = '文件不是目录。'
export const COMMAND__INIT__ERROR_EMPTY_FOLDER = '文件夹不为空。'
export const COMMAND__INIT__ERROR_INVALID_REPO = '回购无效。'
export const COMMAND__INIT__ERROR_FAIL_CLONE = 'GIT克隆失败。'
export const COMMAND__INIT__ERROR_NOT_FOUND_CONFIG_FILE = '找不到 kerberos.json 文件。'
export const COMMAND__INIT__SUCCESS_INIT_GIT = 'Kerberos 配置工程的生成已完成。'
export const COMMAND__INIT__SUCCESS_COMPLETE = 'Kerberos 工作区的初始设置已完成。'
export const COMMAND__INIT__HELP_OPERATION = '输入 <cd #{1}> 进入工作区。'

// command exec
export const COMMAND__EXEC__DESC = '在工程中执行命令'
export const COMMAND__EXEC__OPTION_PROJECT = '指定要执行命令的工程'
export const COMMAND__EXEC__SELECT_PROJECT = '请选择要执行的工程。'
export const COMMAND__EXEC__ERROR_NOT_FOUND_COMMAND = '找不到#{1}命令。'

// command exec-multi
export const COMMAND__EXEC_MULTI__DESC = '在多个工程中执行命令'
export const COMMAND__EXEC_MULTI__OPTION_PROJECT = '指定要执行命令的多个工程'
export const COMMAND__EXEC_MULTI__SELECT_PROJECT = '请选择一个工程来运行脚本。'
export const COMMAND__EXEC_MULTI__ERROR_NOT_FOUND_COMMAND = '找不到#{1}命令。'

// command clone
export const COMMAND__CLONE__DESC = '将 Git 仓库克隆到工作区'
export const COMMAND__CLONE__OPTION_WORKSPACE = '指定 Git 克隆的工作区'
export const COMMAND__CLONE__OPTION_OPTIONAL = '将存储库指定为选择性安装'
export const COMMAND__CLONE__SELECT_WORKSPACE = '请选择一个工作区来克隆存储库。'
export const COMMAND__CLONE__ERROR_INVALID_REPO = '存储库不是有效的 Git 地址。'
export const COMMAND__CLONE__ERROR_EXISTS_PROJECT = '已经存在一个具有相同名称的工程。'
export const COMMAND__CLONE__ERROR_FAILE_CLONE = 'Git 克隆错误。'
export const COMMAND__CLONE__ERROR_INVALID_NODE_PROJECT = '存储库不是NodeJS工程。'
export const COMMAND__CLONE__ERROR_INVALID_PROJECT_NAME = '密码名称无效。'
export const COMMAND__CLONE__SUCCESS_COMPLETE = 'Git 克隆工程已完成。'

// command checkout
export const COMMAND__CHECKOUT__DESC = '检出包中的分支'
export const COMMAND__CHECKOUT__OPTION_BRANCH = '指定要切换的分支'
export const COMMAND__CHECKOUT__OPTION_PROJECT = '指定要切换的工程'
export const COMMAND__CHECKOUT__SELECT_PROJECT = '请选择要切换分支的工程。'
export const COMMAND__CHECKOUT__SELECT_BRANCH = '请选择要切换的分支。'
export const COMMAND__CHECKOUT__SUCCESS_COMPLETE = '工程#{1}已更改为#{2}分支。'

// command branch
export const COMMAND__BRANCH__DESC = '显示工程的所有分支（本地和远程）'
export const COMMAND__BRANCH__OPTION_PROJECT = '指定工程以显示分支'
export const COMMAND__BRANCH__SELECT_PROJECT = '请选择工程以查看分支。'

// command bootstrap
export const COMMAND__BOOTSTRAP__DESC = '初始化工作区并安装所有工程的依赖'
export const COMMAND__BOOTSTRAP__OPTION_YES = '跳过所有问题并以确认作为选项'
export const COMMAND__BOOTSTRAP__OPTION_OPTIONAL = '指定在指定 --yes 选项时安装所有可选依赖项'
export const COMMAND__BOOTSTRAP__SELECT_CLONE_PROJECT = '请选择要克隆的工程。'
export const COMMAND__BOOTSTRAP__CONFIRM_INSTALL_OPTIONAL = '发现未安装某些可选工程，需要为您安装这些工程吗？'
export const COMMAND__BOOTSTRAP__CONFIRM_INSTALL_DEPEDENCIES = '是否需要安装依赖项。'
export const COMMAND__BOOTSTRAP__ERROR_INVALID_PACKAGE = 'Package.json 无效。'
export const COMMAND__BOOTSTRAP__SUCCESS_COMPLETE = 'Boostrap 已完成。'

// command support
export const COMMAND__SUPPORT__DESC = '确定是否已安装所有依赖项'
export const COMMAND__SUPPORT__ERROR_INSTALL_FIRST = '请先安装#{1}。'
export const COMMAND__SUPPORT__SUCCESS = '所有依赖项已准备就绪，您可以正常使用 Kerberos。'

// command run
export const COMMAND__RUN__DESC = '在工程中执行脚本'
export const COMMAND__RUN__OPTION_PROJECT = '指定要运行NPM命令的工程'
export const COMMAND__RUN__SELECT_PROJECT = '请选择要执行的工程。'
export const COMMAND__RUN__SELECT_SCRIPT = '请选择要运行的脚本。'

// command run-multi
export const COMMAND__RUN_MULTI__DESC = '在多个工程中执行脚本'
export const COMMAND__RUN_MULTI__SELECT_PROJECT = '请选择一个工程来运行脚本。'
export const COMMAND__RUN_MULTI__WARN_NOT_FOUND_PROJECT = '在工程#{2}中找不到脚本#{1}。'

// command/share
// -------------

// tryGetBranch
export const COMMAND_SHARE__TRY_GET_BRANCH__SELECT_BRANCH = '#{1}（当前分支：#{2}）'
export const COMMAND_SHARE__TRY_GET_BRANCH__ERROR_NOT_FOUND_BRANCH = '未找到#{1}分支。'

// tryGetProject
export const COMMAND_SHARE__TRY_GET_PROJECT__ERROR_NOT_FOUND_BRANCH = '找不到#{1}工程。'

// tryGetProjects
export const COMMAND_SHARE__TRY_GET_PROJECTS__ERROR_NO_MATCH_PROJECTS = '没有匹配的工程。'

// tryGetScript
export const COMMAND_SHARE__TRY_GET_SCRIPT__ERROR_NOT_FOUND_SCRIPT = '找不到#{1}脚本。'

// tryGetWorkspace
export const COMMAND_SHARE__TRY_GET_WORKSPACE__ERROR_NOT_FOUND_PROJECT = '找不到#{1}工程。'

// interceptors
// ------------

// context
export const INTERCEPTORS__CONTEXT__ERROR_INVALID_PROJECT = '不是 Kerberos 工作空间（或任何父目录）。'

// supported
export const INTERCEPTORS__SUPPORTED__ERROR_NOT_INSTALL_GIT = '不支持 Git，请先安装 Git。'
export const INTERCEPTORS__SUPPORTED__ERROR_NOT_INSTALL_YARN = '不支持 Yarn，可以执行 `npm i -g yarn`。'

// ui
// ------------

export const UI_SELECT_OPTIONS__WORKSPACE__WARN_NOT_FOUND_WORKSPACE = '找不到工作空间。'
export const UI_SELECT_OPTIONS__PROJECT__WARN_NOT_FOUND_PROJECT = '未找到项目。'
export const UI_SELECT_OPTIONS__BRANCH__WARN_NOT_FOUND_BRANCH = '未找到分支。'
export const UI_SELECT_OPTIONS__PROJECT_IN_CONFIG__WARN_NOT_FOUND_PROJECTS = '在#{1}中找不到项目。'

export const UI__GSEL__ERROR_NOT_FOUND_SELECTOR = '找不到#{1}选择器。'
export const UI__G_MULTI_SEL__ERROR_NOT_FOUND_SELECTOR = '找不到#{1}选择器。'
export const UI__CONFIRM__DEFAULT_MESSAGE = '确定吗？'
// commands
// --------

export const alias = '中文'

// options
export const COMMAND__OPTION__VERSION_DESC = '显示当前版本号'
export const COMMAND__OPTION__HELP_DESC = '显示更多用法'
export const COMMAND__OPTION__VERBOSE = '显示执行详情'

// command help
export const COMMAND__HELP__DESC = '显示命令的详细用法'

// command init
export const COMMAND__INIT__DESC = '初始化Kerberos工作区'
export const COMMAND__INIT__ARGS_FOLDER = '指定需要初始化的目录'
export const COMMAND__INIT__ARGS_REPO = '指定需要初始化的Git-Repo'
export const COMMAND__INIT__CONFIRM_CLEAN_MESSAGE = '文件夹不为空，我可以帮您清理一下吗？'
export const COMMAND__INIT__CONFIRM_CREATE_CONFIG_PROJECT = '我可以创建一个新的Kerberos配置项目吗？'
export const COMMAND__INIT__CONFIRM_MOVE_FILES = '此操作将移动您的文件，确定要执行此操作吗？'
export const COMMAND__INIT__WARN_IS_KBPROJECT = '该项目已经是 Kerberos 项目。'
export const COMMAND__INIT__ERROR_SOFT_LINK = '文件#{1}是软链，无法初始化。'
export const COMMAND__INIT__ERROR_NO_PACKAGE = '找不到 package.json 文件。'
export const COMMAND__INIT__ERROR_NO_SETTINGS = '在#{1}中找不到此项目的设置。'
export const COMMAND__INIT__ERROR_INVALID_SETTINGS = '#{1}中的工作区配置设置错误。'
export const COMMAND__INIT__ERROR_INVALID_FOLDER = '文件不是目录。'
export const COMMAND__INIT__ERROR_EMPTY_FOLDER = '文件夹不为空。'
export const COMMAND__INIT__ERROR_INVALID_REPO = '回购无效。'
export const COMMAND__INIT__ERROR_FAIL_CLONE = 'GIT克隆失败。'
export const COMMAND__INIT__ERROR_NOT_FOUND_CONFIG_FILE = '找不到 kerberos.json 文件。'
export const COMMAND__INIT__SUCCESS_INIT_GIT = 'Kerberos 配置项目的生成已完成。'
export const COMMAND__INIT__SUCCESS_COMPLETE = 'Kerberos 工作区的初始设置已完成。'
export const COMMAND__INIT__HELP_OPERATION = '输入 <cd #{1}> 进入工作区。'

// command install
export const COMMAND__INSTALL__DESC = '安装工作区'
export const COMMAND__INSTALL__ARGS_REPO = '指定需要初始化的Git-Repo'
export const COMMAND__INSTALL__OPTION_BRANCH = '指定Git分支'
export const COMMAND__INSTALL__SUCCESS_COMPLETE = '工作区的初始设置已完成。'

// command bootstrap
export const COMMAND__BOOTSTRAP__DESC = '初始化工作区并安装所有项目的依赖'
export const COMMAND__BOOTSTRAP__OPTION_NO_INSTALL = '跳过 Yarn 安装依赖'
export const COMMAND__BOOTSTRAP__OPTION_NO_CLONE = '跳过 Git clone'
export const COMMAND__BOOTSTRAP__OPTION_YES = '跳过所有问题并以确认作为选项'
export const COMMAND__BOOTSTRAP__OPTION_OPTIONAL = '指定在指定 --yes 选项时安装所有可选依赖项'
export const COMMAND__BOOTSTRAP__OPTION_SEQUENCE = '指定按顺序克隆'
export const COMMAND__BOOTSTRAP__SELECT_CLONE_PROJECT = '请选择要克隆的项目。'
export const COMMAND__BOOTSTRAP__CONFIRM_INSTALL_OPTIONAL = '发现未安装某些可选项目，需要为您安装这些项目吗？'
export const COMMAND__BOOTSTRAP__CONFIRM_INSTALL_DEPEDENCIES = '是否需要安装依赖项。'
export const COMMAND__BOOTSTRAP__ERROR_INVALID_PACKAGE = 'Package.json 无效。'
export const COMMAND__BOOTSTRAP__SUCCESS_COMPLETE = 'Boostrap 已完成。'

// command ls
export const COMMAND__LS__DESC = '显示所有项目信息'
export const COMMAND__LS__OPTIONS_PROJECT = '指定项目以显示信息'
export const COMMAND__LS__OPTIONS_DEPENDENCIES = '显示依赖关系列表'
export const COMMAND__LS__WARNING_CIRCULAR_MESSAGE = '项目之间存在循环引用。'

// command clone
export const COMMAND__CLONE__DESC = '将Git仓库克隆到工作区'
export const COMMAND__CLONE__ARGS_REPO = '指定要克隆的Git-Repo'
export const COMMAND__CLONE__ARGS_NAME = '指定克隆下来的名称'
export const COMMAND__CLONE__OPTION_WORKSPACE = '指定 Git 克隆的工作区'
export const COMMAND__CLONE__OPTION_OPTIONAL = '将存储库指定为选择性安装'
export const COMMAND__CLONE__SELECT_WORKSPACE = '请选择一个工作区来克隆存储库。'
export const COMMAND__CLONE__ERROR_INVALID_REPO = '存储库不是有效的 Git 地址。'
export const COMMAND__CLONE__ERROR_EXISTS_PROJECT = '已经存在一个具有相同名称的项目。'
export const COMMAND__CLONE__ERROR_FAILE_CLONE = 'Git 克隆错误。'
export const COMMAND__CLONE__ERROR_PROJECT_NOT_FOUND = '找不到#{1}项目。'
export const COMMAND__CLONE__ERROR_INVALID_NODE_PROJECT = '存储库不是 NodeJS 项目。'
export const COMMAND__CLONE__ERROR_INVALID_PROJECT_NAME = '密码名称无效。'
export const COMMAND__CLONE__SUCCESS_COMPLETE = 'Git 克隆项目已完成。'

// command checkout
export const COMMAND__CHECKOUT__DESC = '检出包中的分支'
export const COMMAND__CHECKOUT__ARGS_BRANCH = '指定需要切换的分支'
export const COMMAND__CHECKOUT__SELECT_PROJECT = '请选择要切换分支的项目。'
export const COMMAND__CHECKOUT__ERROR_NOT_SUBMIT = '项目中的某些文件位于临时存储中（未提交），请先提交。\n#{1}'
export const COMMAND__CHECKOUT__ERROR_FAIL_CHECKOUT = '项目 #{1} 无法切换分支，请手动完成切换。'
export const COMMAND__CHECKOUT__SUCCESS_COMPLETE = '已全部切换到 #{1} 分支。'

// command branch
export const COMMAND__BRANCH__DESC = '显示项目的所有分支（本地和远程）'
export const COMMAND__BRANCH__OPTION_ALL = '列出远程跟踪和本地分支'
export const COMMAND__BRANCH__SELECT_PROJECT = '请选择项目以查看分支。'

// command version
export const COMMAND__VERSION__DESC = '为项目打Tag'
export const COMMAND__VERSION__ARGS_VERSION = '指定版本号'
export const COMMAND__VERSION__OPTION_NO_PUSH = '只更新不提交'
export const COMMAND__VERSION__SELECT_PROJECTS = '请选择要打 Tag 的项目。'
export const COMMAND__VERSION__CONFIRM_DIFF_BRANCHES = '项目在不同的分支中，确定要继续吗？\n#{1} \n'
export const COMMAND__VERSION__INPUT_VERSION = '请输入新的版本号'
export const COMMAND__VERSION__ERROR_NOT_SUBMIT = '项目中的某些文件位于临时存储中（未提交），请先提交。\n#{1}'
export const COMMAND__VERSION__ERROR_RELEASE_BRANCH = '项目 #{1} 不在发布分支 #{2} 中，请在打 Tag 之前将其全部切换到发布分支；发布分支在配置文件中已声明。'
export const COMMAND__VERSION__WARN_NO_REMOTE = '项目 #{1} 没有指定 Origin 远程主机，请手动将其推送到远程主机。'
export const COMMAND__VERSION__WARN_NO_BRANCH = '项目 #{1} 未指定任何分支，请手动推送到远程主机。'
export const COMMAND__VERSION__WARN_COMMIT_FAIL = '项目 #{1} 提交失败，请在提交后重新打Tag。'

// command add
export const COMMAND__ADD__DESC = '安装软件包及其依赖的任何软件包'
export const COMMAND__ADD__ARGS_DEPENDENCIES = '指定需要安装的依赖'
export const COMMAND__ADD__OPTION_PROJECT = '指定要安装软件包的项目'
export const COMMAND__ADD__OPTION_DEV = '将包保存到`devDependencies`'
export const COMMAND__ADD__OPTION_PEER = '将软件包保存到`peerDependencies`'
export const COMMAND__ADD__OPTION_OPTIONAL = '将软件包保存到`optionalDependencies`'

// command remove
export const COMMAND__REMOVE__DESC = '卸载软件包及其依赖的任何软件包'
export const COMMAND__REMOVE__ARGS_DEPENDENCIES = '指定需要卸载的依赖'
export const COMMAND__REMOVE__OPTION_PROJECT = '指定要卸载软件包的项目'

// command run
export const COMMAND__RUN__DESC = '在项目中执行脚本'
export const COMMAND__RUN__ARGS_SCRIPT = '指定需要执行的脚本名称'
export const COMMAND__RUN__OPTION_PROJECT = '指定要运行NPM命令的项目'
export const COMMAND__RUN__OPTION_ROOT = '指定根工作区去执行脚本（将忽略选项 `--project`）'
export const COMMAND__RUN__SELECT_PROJECT = '请选择要执行的项目。'
export const COMMAND__RUN__SELECT_SCRIPT = '请选择要运行的脚本。'

// command run-multi
export const COMMAND__RUN_MULTI__DESC = '在多个项目中执行脚本'
export const COMMAND__RUN_MULTI__ARGS_SCRIPT = '指定需要执行的脚本名称'
export const COMMAND__RUN_MULTI__OPTION_PROJECT = '指定需要执行脚本的项目'
export const COMMAND__RUN_MULTI__OPTION_EXCLUDE = '指定不执行脚本的项目'
export const COMMAND__RUN_MULTI__OPTION_ALL = '指定所有项目都执行该脚本'
export const COMMAND__RUN_MULTI__OPTION_PARALLEL = '并行执行脚本'
export const COMMAND__RUN_MULTI__SELECT_PROJECT = '请选择需要执行脚本的项目。'
export const COMMAND__RUN_MULTI__WARN_NOT_FOUND_PROJECT = '在项目 #{2} 中找不到脚本 #{1}。'

// command exec
export const COMMAND__EXEC__DESC = '在项目中执行命令'
export const COMMAND__EXEC__ARGS_COMMAND = '指定要执行的命令（请使用双引号将命令包装起来）'
export const COMMAND__EXEC__OPTION_PROJECT = '指定要执行命令的项目'
export const COMMAND__EXEC__OPTION_ROOT = '指定根工作区去执行命令（将忽略选项 `--project`）'
export const COMMAND__EXEC__SELECT_PROJECT = '请选择要执行的项目。'
export const COMMAND__EXEC__ERROR_NOT_FOUND_COMMAND = '找不到 #{1} 命令。'

// command exec-multi
export const COMMAND__EXEC_MULTI__DESC = '在多个项目中执行命令'
export const COMMAND__EXEC_MULTI__ARGS_COMMAND = '指定要执行的命令（请使用双引号将命令包装起来）'
export const COMMAND__EXEC_MULTI__OPTION_PROJECT = '指定要执行命令的项目'
export const COMMAND__EXEC_MULTI__OPTION_EXCLUDE = '指定不执行命令的项目'
export const COMMAND__EXEC_MULTI__OPTION_ALL = '指定所有项目都执行该命令'
export const COMMAND__EXEC_MULTI__OPTION_PARALLEL = '并行执行命令'
export const COMMAND__EXEC_MULTI__SELECT_PROJECT = '请选择需要执行命令的项目。'
export const COMMAND__EXEC_MULTI__ERROR_NOT_FOUND_COMMAND = '找不到 #{1} 命令。'

// command run
export const COMMAND__SCRIPT__DESC = '在工作区根目录中执行脚本'
export const COMMAND__SCRIPT__SELECT_SCRIPT = '请选择要运行的脚本。'

// command it
export const COMMAND__IT__DESC = '选择一个项目以输入命令'
export const COMMAND__IT__OPTION_PROJECT = '指定项目以输入命令'
export const COMMAND__IT__ERROR_FOLDER_NOT_FOUND = '不是 Kerberos 项目（或未添加到 kerberos.json 文件中）。'
export const COMMAND__IT__ERROR_COMMAND_NOT_FOUND = '找不到命令#{1}。'
export const COMMAND__IT__HELP_EXIT = '按 `Ctrl + C` 或输入 `exit` 退出。'

// command language
export const COMMAND__LANGUAGE__DESC = '指定CLI语言（当前语言: #{1}）'
export const COMMAND__LANGUAGE__ARGS_LANG = '指定需要切换的语言'
export const COMMAND__LANGUAGE__SELECT_LANGUAGE = '请选择CLI语言.（当前语言: #{1}）'
export const COMMAND__LANGUAGE__ERROR_NOT_EXISTS = '暂时不支持#{1}语言.'
export const COMMAND__LANGUAGE__SUCCESS_MESSAGE = '成功指定#{1}語言。'

// command support
export const COMMAND__SUPPORT__DESC = '确定是否已安装所有依赖项'
export const COMMAND__SUPPORT__ERROR_INSTALL_FIRST = '请先安装#{1}。'
export const COMMAND__SUPPORT__SUCCESS = '所有依赖项已准备就绪，您可以正常使用 Kerberos。'

// command/share
// -------------

// tryGetBranch
export const COMMAND_SHARE__TRY_GET_BRANCH__SELECT_BRANCH = '#{1}（当前分支：#{2}）'
export const COMMAND_SHARE__TRY_GET_BRANCH__ERROR_NOT_FOUND_BRANCH = '未找到#{1}分支。'

// tryGetProject
export const COMMAND_SHARE__TRY_GET_PROJECT__ERROR_NOT_FOUND_BRANCH = '找不到#{1}项目。'

// tryGetProjects
export const COMMAND_SHARE__TRY_GET_PROJECTS__ERROR_NO_MATCH_PROJECTS = '没有匹配的项目。'

// tryGetScript
export const COMMAND_SHARE__TRY_GET_SCRIPT__ERROR_NOT_FOUND_SCRIPT = '找不到#{1}脚本。'

// tryGetWorkspace
export const COMMAND_SHARE__TRY_GET_WORKSPACE__ERROR_NOT_FOUND_PROJECT = '找不到#{1}项目。'

// interceptors
// ------------

// context
export const INTERCEPTORS__CONTEXT__ERROR_INVALID_PROJECT = '当前目录及其任意父级目录均不是 Kerberos 工作区。'

// branch
export const INTERCEPTORS__BRANCH__ERROR_INVALID_BRANCH = '部分项目所在分支不同，请将以下项目切换到 #{1} 分支:\n#{2}'

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

export const UI__SELECT_VERSION__DEFAULT_MESSAGE = '请选择新版本'
export const UI__SELECT_VERSION__INPUT_CUSTOM_PRE_VERSION = '请输入自定义的预发行版本'
export const UI__SELECT_VERSION__INPUT_CUSTOM_VERSION = '请输入自定义版本'

export const UI__INPUT_VERSION__DEFAULT_MESSAGE = '请输入一个新的版本号'
export const UI__INPUT_VERSION__ERROR_INVALID_VERSION = '版本号 #{1} 错误，请确认格式；例如：`1.0.0-alpha.1`'

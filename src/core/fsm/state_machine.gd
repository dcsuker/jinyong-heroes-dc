# 金庸群侠传 DC 版 - 状态机实现

## 游戏状态机

```gdscript
# state_machine.gd
# 通用状态机实现

class_name StateMachine extends Node

# 状态定义
var _states: Dictionary = {}
var _current_state: String = ""
var _previous_state: String = ""

signal state_changed(from_state: String, to_state: String)

## 添加状态
func add_state(state_name: String, enter_cb: Callable = Callable(), exit_cb: Callable = Callable(), process_cb: Callable = Callable()) -> void:
    _states[state_name] = {
        "enter": enter_cb,
        "exit": exit_cb,
        "process": process_cb
    }

## 切换到指定状态
func change_state(new_state: String) -> void:
    if not _states.has(new_state):
        push_error("State not found: " + new_state)
        return

    if _current_state == new_state:
        return

    # Exit current state
    if not _current_state.is_empty() and _states.has(_current_state):
        var exit_cb = _states[_current_state]["exit"]
        if exit_cb.is_valid():
            exit_cb.call()

    _previous_state = _current_state
    _current_state = new_state

    # Enter new state
    var enter_cb = _states[new_state]["enter"]
    if enter_cb.is_valid():
        enter_cb.call()

    state_changed.emit(_previous_state, new_state)

## 处理当前状态
func process(delta: float) -> void:
    if not _current_state.is_empty() and _states.has(_current_state):
        var process_cb = _states[_current_state]["process"]
        if process_cb.is_valid():
            process_cb.call(delta)

## 获取当前状态
func get_current_state() -> String:
    return _current_state

## 获取之前状态
func get_previous_state() -> String:
    return _previous_state

## 检查是否在指定状态
func is_in_state(state_name: String) -> bool:
    return _current_state == state_name
```

## 游戏状态枚举

```gdscript
# game_state.gd

class_name GameState

# 游戏状态枚举
enum State {
    NONE,           # 无状态
    EXPLORATION,    # 探索状态
    DIALOGUE,       # 对话状态
    COMBAT,         # 战斗状态
    PAUSE,          # 暂停状态
    TRANSITION,     # 场景切换状态
    MENU,           # 菜单状态
    SAVE_LOAD,      # 存档读档状态
}

# 状态名称映射
static func get_state_name(state: State) -> String:
    match state:
        State.NONE: return "NONE"
        State.EXPLORATION: return "EXPLORATION"
        State.DIALOGUE: return "DIALOGUE"
        State.COMBAT: return "COMBAT"
        State.PAUSE: return "PAUSE"
        State.TRANSITION: return "TRANSITION"
        State.MENU: return "MENU"
        State.SAVE_LOAD: return "SAVE_LOAD"
        _: return "UNKNOWN"
```

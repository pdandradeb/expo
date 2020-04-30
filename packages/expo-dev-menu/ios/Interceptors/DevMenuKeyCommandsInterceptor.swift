// Copyright 2015-present 650 Industries. All rights reserved.

import UIKit

class DevMenuKeyCommand {
  let keyCommand: UIKeyCommand

  init(withKeyCommand keyCommand: UIKeyCommand) {
    self.keyCommand = keyCommand
  }
}

class DevMenuKeyCommandsInterceptor {
  fileprivate static var commands: [DevMenuKeyCommand] = []
}

extension UIResponder {
  @objc
  func EXDevMenu_keyCommands() -> [UIKeyCommand] {
    return []
  }

  @objc
  func EXDevMenu_handleKeyCommand(_ key: UIKeyCommand) {

  }
}

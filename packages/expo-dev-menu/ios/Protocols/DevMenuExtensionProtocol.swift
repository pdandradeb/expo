// Copyright 2015-present 650 Industries. All rights reserved.

@objc
public protocol DevMenuExtensionProtocol {

  /**
   Returns an array of the dev menu items to show.
   */
  @objc
  optional var devMenuItems: [DevMenuItem]? { get }
}

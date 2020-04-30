// Copyright 2015-present 650 Industries. All rights reserved.

class Dispatch {
  static func mainSync<T>(_ closure: () -> T) -> T {
    if Thread.isMainThread {
      return closure()
    } else {
      var result: T?
      DispatchQueue.main.sync {
        result = closure()
      }
      return result!
    }
  }
}


/**
 Manages the dev menu and provides most of the public API.
 */
@objc
open class DevMenuManager: NSObject {
  /**
   Shared singleton instance.
   */
  @objc
  static public let shared = DevMenuManager()

  /**
   User defaults key used to store bool value whether the user finished onboarding.
   */
  static private let IsOnboardingFinishedUserDefaultsKey = "IsOnboardingFinishedUserDefaultsKey"

  /**
   Returns `true` only if the user finished onboarding, `false` otherwise.
   */
  @objc
  static var isOnboardingFinished: Bool {
    get {
      return UserDefaults.standard.bool(forKey: IsOnboardingFinishedUserDefaultsKey)
    }
    set {
      UserDefaults.standard.set(newValue, forKey: IsOnboardingFinishedUserDefaultsKey)
    }
  }

  /**
   Returns bool value whether the dev menu shake gestures are being intercepted.
   */
  @objc
  static public var interceptsMotionGestures: Bool {
    get {
      return DevMenuMotionInterceptor.isInstalled
    }
    set {
      DevMenuMotionInterceptor.isInstalled = newValue
    }
  }

  /**
   Returns bool value whether the dev menu touch gestures are being intercepted.
   */
  @objc
  static public var interceptsTouchGestures: Bool {
    get {
      return DevMenuTouchInterceptor.isInstalled
    }
    set {
      DevMenuTouchInterceptor.isInstalled = newValue
    }
  }

  /**
   The window that controls and displays the dev menu view.
   */
  var window: DevMenuWindow?

  /**
   `DevMenuAppInstance` instance that is responsible for initializing and managing React Native context for the dev menu.
   */
  var appInstance: DevMenuAppInstance?

  /**
   The delegate of `DevMenuManager` implementing `DevMenuDelegateProtocol`.
   */
  @objc
  public var delegate: DevMenuDelegateProtocol?

  override init() {
    super.init()
    self.window = DevMenuWindow(manager: self)
    self.appInstance = DevMenuAppInstance(manager: self)

    initializeInterceptors()
  }

  /**
   Whether the dev menu window is visible on the device screen.
   */
  @objc
  public var isVisible: Bool {
    return Dispatch.mainSync { !(window?.isHidden ?? true) }
  }

  /**
   Opens up the dev menu.
   */
  @objc
  @discardableResult
  public func openMenu() -> Bool {
    return setVisibility(true)
  }

  /**
   Sends an event to JS to start collapsing the dev menu bottom sheet.
   */
  @objc
  @discardableResult
  public func closeMenu() -> Bool {
    guard let appInstance = appInstance else {
      return false
    }
    appInstance.sendCloseEvent()
    return true
  }

  /**
   Forces the dev menu to hide. Called by JS once collapsing the bottom sheet finishes.
   */
  @objc
  @discardableResult
  public func hideMenu() -> Bool {
    return setVisibility(false)
  }

  /**
   Toggles the visibility of the dev menu.
   */
  @objc
  @discardableResult
  public func toggleMenu() -> Bool {
    return isVisible ? closeMenu() : openMenu()
  }

  // MARK: internals

  func dispatchAction(withId actionId: String) {
    guard let extensions = extensions else {
      return
    }
    for ext in extensions {
      guard let devMenuItems = ext.devMenuItems as? [DevMenuItem] else {
        continue
      }
      for item in devMenuItems {
        if let action = item as? DevMenuAction, action.actionId == actionId {
          action.action()
          return
        }
      }
    }
  }

  /**
   Returns a dictionary of additional app info or nil if not available.
   */
  func currentAppInfo() -> [String : Any]? {
    return delegate?.appInfo?(forDevMenuManager: self)
  }

  /**
   Returns an array of dev menu items serialized to the dictionary.
   */
  func serializedDevMenuItems() -> [[String : Any]] {
    return devMenuItems.map({ $0.serialize() })
  }

  // MARK: delegate stubs

  func canChangeVisibility(to visible: Bool) -> Bool {
    if isVisible == visible {
      return false
    }
    return delegate?.devMenuManager?(self, canChangeVisibility: visible) ?? true
  }

  /**
   Returns bool value whether the onboarding view should be displayed by the dev menu view.
   */
  func shouldShowOnboarding() -> Bool {
    return delegate?.shouldShowOnboarding?(manager: self) ?? !DevMenuManager.self.isOnboardingFinished
  }

  @available(iOS 12.0, *)
  var userInterfaceStyle: UIUserInterfaceStyle {
    return delegate?.userInterfaceStyle?(forDevMenuManager: self) ?? UIUserInterfaceStyle.unspecified
  }

  // MARK: private

  private var extensions: [DevMenuExtensionProtocol]? {
    let appBridge = delegate?.appBridge?(forDevMenuManager: self)
    return appBridge?.modulesConforming(to: DevMenuExtensionProtocol.self) as? [DevMenuExtensionProtocol]
  }

  private var devMenuItems: Array<DevMenuItem> {
    var items: [DevMenuItem] = []

    extensions?.forEach({ ext in
      if let extensionItems = ext.devMenuItems as? [DevMenuItem] {
        items.append(contentsOf: extensionItems)
      }
    })
    return items
  }

  private func initializeInterceptors() {
    DevMenuMotionInterceptor.initialize()
    DevMenuTouchInterceptor.initialize()
  }

  private func setVisibility(_ visible: Bool) -> Bool {
    if !canChangeVisibility(to: visible) {
      return false
    }
    DispatchQueue.main.async {
      if visible {
        self.window?.makeKeyAndVisible()
      } else {
        self.window?.isHidden = true;
      }
    }
    return true
  }
}

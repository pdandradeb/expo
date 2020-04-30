// Copyright 2015-present 650 Industries. All rights reserved.

@objc(DevMenuModule)
open class DevMenuModule: NSObject, RCTBridgeModule, DevMenuExtensionProtocol {
  public static func moduleName() -> String! {
    return "ExpoDevMenu"
  }

  public static func requiresMainQueueSetup() -> Bool {
    return true
  }

  @objc
  open var bridge: RCTBridge?

  // MARK: JavaScript API

  @objc
  func openMenu() {
    DevMenuManager.shared.openMenu()
  }

  // MARK: DevMenuExtensionProtocol

  @objc
  public lazy var devMenuItems: [DevMenuItem]? = {
    guard let devSettings = self.devSettings else {
      return nil
    }
    let isDevModeEnabled = devSettings != nil// isDevModeEnabled()

    if !isDevModeEnabled {
      return nil
    }

    let inspector = DevMenuAction(withId: "dev-inspector") {
      devSettings.toggleElementInspector()
    }
    inspector.isEnabled = { devSettings.isElementInspectorShown }
    inspector.label = { inspector.isEnabled() ? "Hide Element Inspector" : "Show Element Inspector" }
    inspector.glyphName = { "border-style" }

    let remoteDebug = DevMenuAction(withId: "dev-remote-debug") {
      devSettings.isDebuggingRemotely = !devSettings.isDebuggingRemotely
    }
    remoteDebug.isAvailable = { devSettings.isRemoteDebuggingAvailable }
    remoteDebug.isEnabled = { devSettings.isDebuggingRemotely }
    remoteDebug.label = { remoteDebug.isAvailable() ? remoteDebug.isEnabled() ? "Stop Remote Debugging" : "Debug Remote JS" : "Remote Debugger Unavailable" }
    remoteDebug.glyphName = { "remote-desktop" }

    let fastRefresh = DevMenuAction(withId: "dev-fast-refresh") {
      devSettings.isHotLoadingEnabled = !devSettings.isHotLoadingEnabled
    }
    fastRefresh.isAvailable = { devSettings.isHotLoadingAvailable }
    fastRefresh.isEnabled = { devSettings.isHotLoadingEnabled }
    fastRefresh.label = { fastRefresh.isAvailable() ? fastRefresh.isEnabled() ? "Disable Fast Refresh" : "Enable Fast Refresh" : "Fast Refresh Unavailable" }
    fastRefresh.glyphName = { "run-fast" }

    let perfMonitor = DevMenuAction(withId: "dev-perf-monitor") {
      if let perfMonitorModule = self.bridge?.module(forName: "PerfMonitor") as? RCTPerfMonitor {
        DispatchQueue.main.async {
          devSettings.isPerfMonitorShown ? perfMonitorModule.hide() : perfMonitorModule.show()
          devSettings.isPerfMonitorShown = !devSettings.isPerfMonitorShown
        }
      }
    }
    perfMonitor.isAvailable = { self.bridge?.module(forName: "PerfMonitor") != nil }
    perfMonitor.isEnabled = { devSettings.isPerfMonitorShown }
    perfMonitor.label = { perfMonitor.isAvailable() ? perfMonitor.isEnabled() ? "Hide Performance Monitor" : "Show Performance Monitor" : "Performance Monitor Unavailable" }
    perfMonitor.glyphName = { "speedometer" }

    return [inspector, remoteDebug, fastRefresh, perfMonitor]
  }()

  // MARK: private

  private var devSettings: RCTDevSettings? {
    return bridge?.module(forName: "DevSettings") as? RCTDevSettings
  }
}

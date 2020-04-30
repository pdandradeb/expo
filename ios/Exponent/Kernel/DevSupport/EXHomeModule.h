// Copyright 2015-present 650 Industries. All rights reserved.

#import "EXScopedEventEmitter.h"

@class EXHomeModule;
@import EXDevMenu;

@protocol EXHomeModuleDelegate <NSObject>

- (void)homeModule:(EXHomeModule *)module didOpenUrl:(NSString *)url;
- (void)homeModuleDidSelectQRReader:(EXHomeModule *)module;

@end

@interface EXHomeModule : EXScopedEventEmitter <DevMenuExtensionProtocol>

- (void)dispatchJSEvent: (NSString *)eventName
                   body: (NSDictionary *)eventBody
              onSuccess: (void (^)(NSDictionary *))success
              onFailure: (void (^)(NSString *))failure;

@end

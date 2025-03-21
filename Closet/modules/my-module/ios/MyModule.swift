import ExpoModulesCore
@available(iOS 16.0, *)
public class MyModule: Module {
  // Each module class must implement the definition function. The definition consists of components
  // that describes the module's functionality and behavior.
  // See https://docs.expo.dev/modules/module-api for more details about available components.
  public func definition() -> ModuleDefinition {
    // Sets the name of the module that JavaScript code will use to refer to the module. Takes a string as an argument.
    // Can be inferred from module's class name, but it's recommended to set it explicitly for clarity.
    // The module will be accessible from `requireNativeModule('MyModule')` in JavaScript.
    Name("MyModule")


    AsyncFunction("getSubjectImageURL") { (imagePath: String, promise: Promise) in
        print("📸 Received Image Path: \(imagePath)")

        Task {
          do {
            let fileUrl = URL(fileURLWithPath: imagePath.replacingOccurrences(of: "file://", with: ""))

            guard let imageData = try? Data(contentsOf: fileUrl),
                  let image = UIImage(data: imageData) else {
              promise.reject("ImageLoadError", "Failed to load image.")
              return
            }

            // Extract subject asynchronously
            if let subjectImageUrl = await MyModuleView().liftSubject(from: image) {
              promise.resolve(subjectImageUrl)  // ✅ Return file URL to JS
            } else {
              promise.reject("SubjectExtractionError", "Failed to extract subject from image.")
            }
          }
          // } catch {
          //   promise.reject("FileWriteError", "Failed to save image.")
          // }
        }
      }


    // Sets constant properties on the module. Can take a dictionary or a closure that returns a dictionary.
    Constants([
      "PI": Double.pi
    ])

    // Defines event names that the module can send to JavaScript.
    Events("onChange")

    // Defines a JavaScript synchronous function that runs the native code on the JavaScript thread.
    Function("hello") {
      return "Hello world! 👋"
    }

    // Defines a JavaScript function that always returns a Promise and whose native code
    // is by default dispatched on the different thread than the JavaScript runtime runs on.
    AsyncFunction("setValueAsync") { (value: String) in
      // Send an event to JavaScript.
      self.sendEvent("onChange", [
        "value": value
      ])
    }

    // Enables the module to be used as a native view. Definition components that are accepted as part of the
    // view definition: Prop, Events.
    View(MyModuleView.self) {
    Prop("url") { (view: MyModuleView, urlString: String) in
        guard let url = URL(string: urlString) else {
            print("❌ Invalid URL: \(urlString)")
            return
        }

        if view.webView.url != url {
            print("🌍 Loading URL: \(url)")
            if urlString.starts(with: "file://") {
              let filePath = urlString.replacingOccurrences(of: "file://", with: "")
              if let image = UIImage(contentsOfFile: filePath) {
                  // print("📂 Loading local image: \(filePath)")
                  // view.imageView.image = image // ✅ Show image in UIImageView
                  view.assignedImage = image

              } else {
                  print("❌ Failed to load local image from: \(filePath)")
              }
            }
        }
    }



      // Events("onLoad")
    }
  }
}

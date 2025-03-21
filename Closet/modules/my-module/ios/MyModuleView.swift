import ExpoModulesCore
import WebKit
import VisionKit


@available(iOS 16.0, *)
// This view will be used as a native component. Make sure to inherit from `ExpoView`
// to apply the proper styling (e.g. border radius and shadows).
class MyModuleView: ExpoView {
  let webView = WKWebView()
  let onLoad = EventDispatcher()
  let view = UIView()
  let imageView = UIImageView()
  let subjectImageView = UIImageView()
  let interaction = ImageAnalysisInteraction()
  let analyzer = ImageAnalyzer()
  let configuration = ImageAnalyzer.Configuration([ .text, .visualLookUp, .machineReadableCode ])
  
  @objc var assignedImage: UIImage? {
    didSet {
        print("🖼 Image changed in MyModuleView!")

        if let image = assignedImage {
            imageView.image = image // ✅ Update imageView
            processImage(image) // ✅ Optional: Process the image
        }
    }
}


 
  required init(appContext: AppContext? = nil) {
    
    super.init(appContext: appContext)
    addSubview(view)

    view.translatesAutoresizingMaskIntoConstraints = false
    imageView.translatesAutoresizingMaskIntoConstraints = false
    subjectImageView.translatesAutoresizingMaskIntoConstraints = false

    view.addSubview(imageView)
    view.addSubview(subjectImageView)

    NSLayoutConstraint.activate([
      // imageView.topAnchor.constraint(equalTo: view.topAnchor, constant: 20),
      // imageView.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 20),
      // imageView.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -20),
      // imageView.heightAnchor.constraint(equalTo: view.heightAnchor, multiplier: 0.4),
    imageView.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor, constant: 20),
    imageView.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 10),
    imageView.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -10),
    imageView.heightAnchor.constraint(equalTo: view.heightAnchor, multiplier: 0.5)
    ])

    imageView.contentMode = .scaleAspectFit
    imageView.clipsToBounds = true 
    subjectImageView.contentMode = .scaleAspectFit
    subjectImageView.clipsToBounds = true 

    imageView.layer.borderWidth = 1
    imageView.layer.borderColor = UIColor.lightGray.cgColor

    subjectImageView.layer.borderWidth = 1
    subjectImageView.layer.borderColor = UIColor.lightGray.cgColor

    // DispatchQueue.main.async{
    //   let image = UIImage(named: "dog")
    //   self.imageView.image = image
    //   self.imageView.addInteraction(self.interaction)
    //   Task {
    //     if let image = image {
    //       let subjectImage = await self.liftSubject(from: image)
    //       self.subjectImageView.image = subjectImage
    //     }
    //   }
    // }
  }

  override func layoutSubviews(){
    view.frame = bounds
  }

  // func liftSubject(from image: UIImage) async -> UIImage? {
  //   let analysis = try? await analyzer.analyze(image, configuration: configuration)
  //   guard let analysis = analysis else { return nil }

  //   await MainActor.run {
  //     interaction.analysis = analysis
  //     interaction.preferredInteractionTypes = [.automatic]

  //   }
  //   //debugPrint("\(await interaction.subjects.count)")

  //   guard let subject = await interaction.subjects.first else{ 
  //     return nil
  //   }

  //   guard let cropped = try? await subject.image else{
  //     return nil
  //   }

  //   return cropped
  // }

  // func liftSubject(from image: UIImage) async -> String? {
  //       do {
  //           let analysis = try? await analyzer.analyze(image, configuration: configuration)
  //           guard let subject = analysis else {
  //               print("❌ No subject detected.")
  //               return nil
  //           }

  //           guard let cropped: UIImage = try? await subject.image, let imageData = cropped.pngData() else {
  //               print("❌ Failed to extract subject.")
  //               return nil
  //           }

  //           // ✅ Save the image to temporary storage
  //           let tempDir = FileManager.default.temporaryDirectory
  //           let outputFileUrl = tempDir.appendingPathComponent("subject.png")

  //           try imageData.write(to: outputFileUrl)
  //           print("✅ Subject Image Saved: \(outputFileUrl.absoluteString)")

  //           return outputFileUrl.absoluteString  // ✅ Return file URL
  //       } catch {
  //           print("❌ Error extracting subject: \(error)")
  //           return nil
  //       }
  // }


  func liftSubject(from image: UIImage) async -> String? {
    do{
    let analysis = try? await analyzer.analyze(image, configuration: configuration)
    guard let analysis = analysis else { return nil }

    await MainActor.run {
      interaction.analysis = analysis
      interaction.preferredInteractionTypes = [.automatic]

    }
    //debugPrint("\(await interaction.subjects.count)")

    guard let subject = await interaction.subjects.first else{ 
      return nil
    }

    guard let cropped = try? await subject.image else{
      return nil
    }

    guard let imageData = cropped.pngData() else {
      return nil
    }
  // ✅ Save the image to temporary storage
    let uniqueFileName = UUID().uuidString + ".png"
    let tempDir = FileManager.default.temporaryDirectory
    let outputFileUrl = tempDir.appendingPathComponent(uniqueFileName)

    try imageData.write(to: outputFileUrl)
    print("✅ Subject Image Saved: \(outputFileUrl.absoluteString)")

    return outputFileUrl.absoluteString  // ✅ Return file URL
        } catch {
            print("❌ Error extracting subject: \(error)")
            return nil
        }

  }


  // ✅ Function to handle "url" prop updates
    func setUrl(_ newUrl: String?) {
    guard let url = newUrl, !url.isEmpty else { return }

    if url.hasPrefix("http") {
        // Load a webpage in WebView
        if let webUrl = URL(string: url) {
            webView.isHidden = false
            imageView.isHidden = true
            webView.load(URLRequest(url: webUrl))
        }
    } else if url.hasPrefix("file://") {
        // Load a local image file into UIImageView
        if let localUrl = URL(string: url) {
            let filePath = localUrl.path // Convert file:// to system path
            if let image = UIImage(contentsOfFile: filePath) {
                imageView.isHidden = false
                webView.isHidden = true
                imageView.image = image
            } else {
                print("⚠️ Failed to load local image: \(filePath)")
            }
        }
    } else if url.hasPrefix("data:image") {
        // Handle Base64 Encoded Images
        if let base64String = url.components(separatedBy: ",").last, 
           let imageData = Data(base64Encoded: base64String),
           let image = UIImage(data: imageData) {
            imageView.isHidden = false
            webView.isHidden = true
            imageView.image = image
        }
    } else {
        print("⚠️ Unsupported URL format: \(url)")
    }
}

func loadImage(from uri: String) {
    DispatchQueue.main.async {
      if uri.hasPrefix("file://") {
        // ✅ Load local image
        let filePath = URL(fileURLWithPath: uri).path
        if let image = UIImage(contentsOfFile: filePath) {
          self.processImage(image)
        } else {
          print("⚠️ Failed to load local image: \(filePath)")
        }
      } else if uri.hasPrefix("http") {
        // ✅ Load remote image
        guard let url = URL(string: uri) else {
          print("⚠️ Invalid URL: \(uri)")
          return
        }
        let task = URLSession.shared.dataTask(with: url) { data, _, error in
          if let error = error {
            print("⚠️ Error loading image: \(error.localizedDescription)")
            return
          }
          if let data = data, let image = UIImage(data: data) {
            DispatchQueue.main.async {
              self.processImage(image)
            }
          }
        }
        task.resume()
      } else {
        print("⚠️ Unsupported URI format: \(uri)")
      }
    }
  }

  // func processImage(_ image: UIImage) {
  //   self.imageView.image = image
  //   self.imageView.addInteraction(self.interaction)

  //   Task {
  //     let subjectImage = await self.liftSubject(from: image)
  //     DispatchQueue.main.async {
  //       self.subjectImageView.image = subjectImage
  //     }
  //   }
  // }
  func processImage(_ image: UIImage) {
        self.imageView.image = image
        self.imageView.addInteraction(self.interaction)

        Task {
            if let subjectImageUrl = await self.liftSubject(from: image) {
                DispatchQueue.main.async {
                    self.subjectImageView.image = UIImage(contentsOfFile: URL(string: subjectImageUrl)!.path)
                    print("📸 Subject Image URL: \(subjectImageUrl)")
                }
            }
        }
    }

  

//   var delegate: WebViewDelegate?


//   required init(appContext: AppContext? = nil) {
//     super.init(appContext: appContext)
//     clipsToBounds = true
//     delegate = WebViewDelegate { url in
//       self.onLoad(["url": url])
//     }
//     webView.navigationDelegate = delegate
//     addSubview(webView)
//   }

//   override func layoutSubviews() {
//     webView.frame = bounds
//   }
// }

// class WebViewDelegate: NSObject, WKNavigationDelegate {
//   let onUrlChange: (String) -> Void

//   init(onUrlChange: @escaping (String) -> Void) {
//     self.onUrlChange = onUrlChange
//   }

//   func webView(_ webView: WKWebView, didFinish navigation: WKNavigation) {
//     if let url = webView.url {
//       onUrlChange(url.absoluteString)
//     }
//   }
}

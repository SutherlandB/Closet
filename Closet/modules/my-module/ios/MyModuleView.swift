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

  required init(appContext: AppContext? = nil) {
    super.init(appContext: appContext)
    addSubview(view)

    imageView.translatesAutoresizingMaskIntoConstraints = false
    subjectImageView.translatesAutoresizingMaskIntoConstraints = false

    view.addSubview(imageView)
    view.addSubview(subjectImageView)

    NSLayoutConstraint.activate([
      imageView.topAnchor.constraint(equalTo: view.topAnchor, constant: 20),
      imageView.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 20),
      imageView.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -20),
      imageView.heightAnchor.constraint(equalTo: view.heightAnchor, multiplier: 0.4),
    ])

    imageView.contentMode = .scaleAspectFit
    subjectImageView.contentMode = .scaleAspectFit

    imageView.layer.borderWidth = 1
    imageView.layer.borderColor = UIColor.lightGray.cgColor

    subjectImageView.layer.borderWidth = 1
    subjectImageView.layer.borderColor = UIColor.lightGray.cgColor

    DispatchQueue.main.async{
      let image = UIImage(named: "dog")
      self.imageView.image = image
      self.imageView.addInteraction(self.interaction)
      Task {
        if let image = image {
          let subjectImage = await self.liftSubject(from: image)
          self.subjectImageView.image = subjectImage
        }
      }
    }
  }

  override func layoutSubviews(){
    view.frame = bounds
  }

  func liftSubject(from image: UIImage) async -> UIImage? {
    let analysis = try? await analyzer.analyze(image, configuration: configuration)
    guard let analysis = analysis else { return nil }

    await MainActor.run {
      interaction.analysis = analysis
      interaction.preferredInteractionTypes = [.automatic]

    }
    debugPrint("\(await interaction.subjects.count)")

    guard let subject = await interaction.subjects.first else{ 
      return nil
    }

    guard let cropped = try? await subject.image else{
      return nil
    }

    return cropped
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

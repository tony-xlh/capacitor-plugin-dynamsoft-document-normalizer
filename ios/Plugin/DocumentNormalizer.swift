import Foundation

@objc public class DocumentNormalizer: NSObject {
    @objc public func echo(_ value: String) -> String {
        print(value)
        return value
    }
}

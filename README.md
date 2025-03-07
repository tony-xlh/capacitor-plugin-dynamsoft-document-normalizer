# capacitor-plugin-dynamsoft-document-normalizer

A document scanning plugin for Capacitor using [Dynamsoft Document Normalizer](https://www.dynamsoft.com/document-normalizer/docs/).

[Online demo](https://chic-syrniki-fac13f.netlify.app/)

## Versions

For Capacitor v7, use versions 4.x.

For Capacitor v6, use versions 3.x.

For Capacitor v5, use versions 1.x and 2.x.

For Capacitor v4, use v0.x.

## SDK Versions Used for Different Platforms

| Product      | Android |    iOS | Web |
| ----------- | ----------- | -----------  | -------  |
| Dynamsoft Document Normalizer    | 2.x       | 2.x     | 2.x     |

## Supported Platforms

* Web
* Android
* iOS

## Install

```bash
npm install capacitor-plugin-dynamsoft-document-normalizer
npx cap sync
```

## API

<docgen-index>

* [`initialize()`](#initialize)
* [`initLicense(...)`](#initlicense)
* [`initRuntimeSettingsFromString(...)`](#initruntimesettingsfromstring)
* [`detect(...)`](#detect)
* [`detectBitmap(...)`](#detectbitmap)
* [`normalize(...)`](#normalize)
* [`detectAndNormalize(...)`](#detectandnormalize)
* [`setEngineResourcePaths(...)`](#setengineresourcepaths)
* [Interfaces](#interfaces)
* [Enums](#enums)

</docgen-index>

<docgen-api>
<!--Update the source file JSDoc comments and rerun docgen to update the docs below-->

### initialize()

```typescript
initialize() => Promise<void>
```

--------------------


### initLicense(...)

```typescript
initLicense(options: { license: string; }) => Promise<void>
```

| Param         | Type                              |
| ------------- | --------------------------------- |
| **`options`** | <code>{ license: string; }</code> |

--------------------


### initRuntimeSettingsFromString(...)

```typescript
initRuntimeSettingsFromString(options: { template: string; }) => Promise<void>
```

| Param         | Type                               |
| ------------- | ---------------------------------- |
| **`options`** | <code>{ template: string; }</code> |

--------------------


### detect(...)

```typescript
detect(options: { path?: string; source?: string | HTMLImageElement | HTMLCanvasElement; template?: string; }) => Promise<{ results: DetectedQuadResultItem[]; }>
```

source: Android and iOS only support base64 string.
path: for Android and iOS.
template: pass a template name to specify the template

| Param         | Type                                                             |
| ------------- | ---------------------------------------------------------------- |
| **`options`** | <code>{ path?: string; source?: any; template?: string; }</code> |

**Returns:** <code>Promise&lt;{ results: DetectedQuadResultItem[]; }&gt;</code>

--------------------


### detectBitmap(...)

```typescript
detectBitmap(options: { className?: string; methodName?: string; template?: string; }) => Promise<{ results: DetectedQuadResultItem[]; }>
```

Android and iOS only method which directly reads camera frames from capacitor-plugin-camera.  Pass a template name to specify the template.

| Param         | Type                                                                         |
| ------------- | ---------------------------------------------------------------------------- |
| **`options`** | <code>{ className?: string; methodName?: string; template?: string; }</code> |

**Returns:** <code>Promise&lt;{ results: DetectedQuadResultItem[]; }&gt;</code>

--------------------


### normalize(...)

```typescript
normalize(options: { path?: string; source?: string | HTMLImageElement | HTMLCanvasElement; quad: Quadrilateral; template?: string; saveToFile?: boolean; includeBase64?: boolean; }) => Promise<{ result: NormalizedImageResult; }>
```

source: Android and iOS only support base64 string.
path: for Android and iOS.
template: pass a template name to specify the template

| Param         | Type                                                                                                                                                              |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`options`** | <code>{ path?: string; source?: any; quad: <a href="#quadrilateral">Quadrilateral</a>; template?: string; saveToFile?: boolean; includeBase64?: boolean; }</code> |

**Returns:** <code>Promise&lt;{ result: <a href="#normalizedimageresult">NormalizedImageResult</a>; }&gt;</code>

--------------------


### detectAndNormalize(...)

```typescript
detectAndNormalize(options: { path?: string; source?: string | HTMLImageElement | HTMLCanvasElement; template?: string; saveToFile?: boolean; includeBase64?: boolean; }) => Promise<{ result: NormalizedImageResult; }>
```

source: Android and iOS only support base64 string.
path: for Android and iOS.
template: pass a template name to specify the template

| Param         | Type                                                                                                            |
| ------------- | --------------------------------------------------------------------------------------------------------------- |
| **`options`** | <code>{ path?: string; source?: any; template?: string; saveToFile?: boolean; includeBase64?: boolean; }</code> |

**Returns:** <code>Promise&lt;{ result: <a href="#normalizedimageresult">NormalizedImageResult</a>; }&gt;</code>

--------------------


### setEngineResourcePaths(...)

```typescript
setEngineResourcePaths(options: { paths: any; }) => Promise<void>
```

Web Only

| Param         | Type                         |
| ------------- | ---------------------------- |
| **`options`** | <code>{ paths: any; }</code> |

--------------------


### Interfaces


#### DetectedQuadResultItem

| Prop                               | Type                                                                                | Description                                                                                                       |
| ---------------------------------- | ----------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| **`location`**                     | <code><a href="#quadrilateral">Quadrilateral</a></code>                             |                                                                                                                   |
| **`confidenceAsDocumentBoundary`** | <code>number</code>                                                                 |                                                                                                                   |
| **`CrossVerificationStatus`**      | <code><a href="#enumcrossverificationstatus">EnumCrossVerificationStatus</a></code> | Indicates whether the <a href="#detectedquadresultitem">DetectedQuadResultItem</a> has passed corss verification. |


#### Quadrilateral

| Prop         | Type                                                                                |
| ------------ | ----------------------------------------------------------------------------------- |
| **`points`** | <code>[Point, <a href="#point">Point</a>, <a href="#point">Point</a>, Point]</code> |
| **`area`**   | <code>number</code>                                                                 |


#### Point

| Prop    | Type                |
| ------- | ------------------- |
| **`x`** | <code>number</code> |
| **`y`** | <code>number</code> |


#### NormalizedImageResult

| Prop         | Type                |
| ------------ | ------------------- |
| **`base64`** | <code>string</code> |
| **`path`**   | <code>string</code> |


### Enums


#### EnumCrossVerificationStatus

| Members                | Value          | Description                                          |
| ---------------------- | -------------- | ---------------------------------------------------- |
| **`CVS_NOT_VERIFIED`** | <code>0</code> | The cross verification has not been performed yet.   |
| **`CVS_PASSED`**       | <code>1</code> | The cross verification has been passed successfully. |
| **`CVS_FAILED`**       | <code>2</code> | The cross verification has failed.                   |

</docgen-api>

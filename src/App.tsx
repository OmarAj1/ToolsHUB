import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { Layout } from "./components/layout/Layout";
import { ToolLayout } from "./components/layout/ToolLayout";
import { DebugPanel } from "./components/DebugPanel";

// Pages
import { Home } from "./pages/Home";
import { Category } from "./pages/Category";
import { PrivacyPolicy } from "./pages/PrivacyPolicy";
import { TermsOfService } from "./pages/TermsOfService";

// Tools
const WordCounter = lazy(() => import("./tools/text/WordCounter").then(m => ({ default: m.WordCounter })));
const RemoveDuplicateLines = lazy(() => import("./tools/text/TextModifiers").then(m => ({ default: m.RemoveDuplicateLines })));
const SortLines = lazy(() => import("./tools/text/TextModifiers").then(m => ({ default: m.SortLines })));
const ReverseLines = lazy(() => import("./tools/text/TextModifiers").then(m => ({ default: m.ReverseLines })));
const CaseConverter = lazy(() => import("./tools/text/TextModifiers").then(m => ({ default: m.CaseConverter })));
const ExtractEmails = lazy(() => import("./tools/text/TextModifiers").then(m => ({ default: m.ExtractEmails })));
const ExtractUrls = lazy(() => import("./tools/text/TextModifiers").then(m => ({ default: m.ExtractUrls })));
const RemoveEmptyLines = lazy(() => import("./tools/text/TextModifiers").then(m => ({ default: m.RemoveEmptyLines })));
const WhitespaceRemover = lazy(() => import("./tools/text/TextModifiers").then(m => ({ default: m.WhitespaceRemover })));
const TextCompare = lazy(() => import("./tools/text/TextToolsExtra").then(m => ({ default: m.TextCompare })));
const FindAndReplace = lazy(() => import("./tools/text/TextToolsExtra").then(m => ({ default: m.FindAndReplace })));
const CsvCleaner = lazy(() => import("./tools/text/TextToolsExtra").then(m => ({ default: m.CsvCleaner })));
const TextFormatter = lazy(() => import("./tools/text/TextToolsExtra").then(m => ({ default: m.TextFormatter })));

const JsonFormatter = lazy(() => import("./tools/dev/JsonFormatter").then(m => ({ default: m.JsonFormatter })));
const Base64Encoder = lazy(() => import("./tools/dev/Base64Encoder").then(m => ({ default: m.Base64Encoder })));

const ProfitCalculator = lazy(() => import("./tools/seller/ProfitCalculator").then(m => ({ default: m.ProfitCalculator })));
const RoiCalculator = lazy(() => import("./tools/seller/SellerCalculators").then(m => ({ default: m.RoiCalculator })));
const MarketplaceFeeCalculator = lazy(() => import("./tools/seller/SellerCalculators").then(m => ({ default: m.MarketplaceFeeCalculator })));
const PricingCalculator = lazy(() => import("./tools/seller/SellerCalculators").then(m => ({ default: m.PricingCalculator })));
const BreakEvenCalculator = lazy(() => import("./tools/seller/SellerCalculators").then(m => ({ default: m.BreakEvenCalculator })));
const MarginCalculator = lazy(() => import("./tools/seller/SellerCalculators").then(m => ({ default: m.MarginCalculator })));
const DiscountCalculator = lazy(() => import("./tools/seller/SellerCalculators").then(m => ({ default: m.DiscountCalculator })));
const SalesTaxCalculator = lazy(() => import("./tools/seller/SellerCalculators").then(m => ({ default: m.SalesTaxCalculator })));
const RevenueForecastTool = lazy(() => import("./tools/seller/SellerCalculators").then(m => ({ default: m.RevenueForecastTool })));
const ProductCostCalculator = lazy(() => import("./tools/seller/SellerCalculators").then(m => ({ default: m.ProductCostCalculator })));

// New Dev Tools (Lazy Loaded Chunk)
const JsonValidator = lazy(() => import("./tools/dev/JsonValidator").then(m => ({ default: m.JsonValidator })));
const RegexTester = lazy(() => import("./tools/dev/RegexTester").then(m => ({ default: m.RegexTester })));
const JwtDecoder = lazy(() => import("./tools/dev/JwtTools").then(m => ({ default: m.JwtDecoder })));
const JwtInspector = lazy(() => import("./tools/dev/JwtTools").then(m => ({ default: m.JwtInspector })));
const Base64Decoder = lazy(() => import("./tools/dev/Base64Decoder").then(m => ({ default: m.Base64Decoder })));
const UrlEncoderDecoder = lazy(() => import("./tools/dev/UrlEncoderDecoder").then(m => ({ default: m.UrlEncoderDecoder })));
const ColorConverter = lazy(() => import("./tools/dev/ColorConverter").then(m => ({ default: m.ColorConverter })));
const ApiTester = lazy(() => import("./tools/dev/ApiTester").then(m => ({ default: m.ApiTester })));
const UuidGenerator = lazy(() => import("./tools/dev/UuidGenerator").then(m => ({ default: m.UuidGenerator })));
const HashGenerator = lazy(() => import("./tools/dev/HashGenerator").then(m => ({ default: m.HashGenerator })));
const SqlFormatterTool = lazy(() => import("./tools/dev/Formatters").then(m => ({ default: m.SqlFormatterTool })));
const XmlFormatterTool = lazy(() => import("./tools/dev/Formatters").then(m => ({ default: m.XmlFormatterTool })));
const CsvToJson = lazy(() => import("./tools/dev/CsvJsonConverter").then(m => ({ default: m.CsvToJson })));
const JsonToCsv = lazy(() => import("./tools/dev/CsvJsonConverter").then(m => ({ default: m.JsonToCsv })));

// Student Toolkit Tools
const GpaCalculator = lazy(() => import("./tools/student/Calculators").then(m => ({ default: m.GpaCalculator })));
const GradeCalculator = lazy(() => import("./tools/student/Calculators").then(m => ({ default: m.GradeCalculator })));
const ReadingTimeCalculator = lazy(() => import("./tools/student/Calculators").then(m => ({ default: m.ReadingTimeCalculator })));
const StudyScheduleGenerator = lazy(() => import("./tools/student/Planners").then(m => ({ default: m.StudyScheduleGenerator })));
const ExamCountdownTracker = lazy(() => import("./tools/student/Planners").then(m => ({ default: m.ExamCountdownTracker })));
const AssignmentPlanner = lazy(() => import("./tools/student/Planners").then(m => ({ default: m.AssignmentPlanner })));
const SemesterPlanner = lazy(() => import("./tools/student/Planners").then(m => ({ default: m.SemesterPlanner })));
const CitationFormatter = lazy(() => import("./tools/student/Formatters").then(m => ({ default: m.CitationFormatter })));
const FlashcardExporter = lazy(() => import("./tools/student/Formatters").then(m => ({ default: m.FlashcardExporter })));
const NoteFormatter = lazy(() => import("./tools/student/Formatters").then(m => ({ default: m.NoteFormatter })));

// PDF Tools
const MergePdf = lazy(() => import("./tools/pdf/MergePdf").then(m => ({ default: m.MergePdf })));

// Creator & Gaming
const YoutubeTitleChecker = lazy(() => import("./tools/creator/CreatorTools").then(m => ({ default: m.YoutubeTitleChecker })));
const HashtagGenerator = lazy(() => import("./tools/creator/CreatorTools").then(m => ({ default: m.HashtagGenerator })));
const ReadTimeEstimator = lazy(() => import("./tools/creator/CreatorTools").then(m => ({ default: m.ReadTimeEstimator })));
const SocialPostPreview = lazy(() => import("./tools/creator/CreatorTools").then(m => ({ default: m.SocialPostPreview })));
const DescriptionGenerator = lazy(() => import("./tools/creator/CreatorTools").then(m => ({ default: m.DescriptionGenerator })));

const KdCalculator = lazy(() => import("./tools/gaming/GamingTools").then(m => ({ default: m.KdCalculator })));
const EdpiCalculator = lazy(() => import("./tools/gaming/GamingTools").then(m => ({ default: m.EdpiCalculator })));
const SensConverter = lazy(() => import("./tools/gaming/GamingTools").then(m => ({ default: m.SensConverter })));
const XpCalculator = lazy(() => import("./tools/gaming/GamingTools").then(m => ({ default: m.XpCalculator })));
const AspectRatioCalc = lazy(() => import("./tools/gaming/GamingTools").then(m => ({ default: m.AspectRatioCalc })));

// New Tool Placeholders

const CronJobGenerator = lazy(() => import("./tools/dev/CronJobGenerator").then(m => ({ default: m.CronJobGenerator })));
const YamlJsonConverter = lazy(() => import("./tools/dev/YamlJsonConverter").then(m => ({ default: m.YamlJsonConverter })));
const JwtBuilder = lazy(() => import("./tools/dev/JwtBuilder").then(m => ({ default: m.JwtBuilder })));

const MarkdownToHtml = lazy(() => import("./tools/text/MarkdownToHtml").then(m => ({ default: m.MarkdownToHtml })));
const DiffViewer = lazy(() => import("./tools/text/DiffViewer").then(m => ({ default: m.DiffViewer })));
const LoremIpsumGenerator = lazy(() => import("./tools/text/LoremIpsumGenerator").then(m => ({ default: m.LoremIpsumGenerator })));

const FovConverter = lazy(() => import("./tools/gaming/FovConverter").then(m => ({ default: m.FovConverter })));
const MousePollingChecker = lazy(() => import("./tools/gaming/MousePollingChecker").then(m => ({ default: m.MousePollingChecker })));
const ReactionTimeTester = lazy(() => import("./tools/gaming/ReactionTimeTester").then(m => ({ default: m.ReactionTimeTester })));

const PomodoroTimer = lazy(() => import("./tools/productivity/PomodoroTimer").then(m => ({ default: m.PomodoroTimer })));
const SynonymSwapper = lazy(() => import("./tools/education/SynonymSwapper").then(m => ({ default: m.SynonymSwapper })));
const InteractiveFlashcards = lazy(() => import("./tools/education/InteractiveFlashcards").then(m => ({ default: m.InteractiveFlashcards })));

const LocalInvoiceGenerator = lazy(() => import("./tools/business/LocalInvoiceGenerator").then(m => ({ default: m.LocalInvoiceGenerator })));
const QrBarcodeGenerator = lazy(() => import("./tools/business/QrBarcodeGenerator").then(m => ({ default: m.QrBarcodeGenerator })));
const CpmCalculator = lazy(() => import("./tools/business/CpmCalculator").then(m => ({ default: m.CpmCalculator })));

const ThumbnailSafeZone = lazy(() => import("./tools/creator/ThumbnailSafeZone").then(m => ({ default: m.ThumbnailSafeZone })));
const ExifStripper = lazy(() => import("./tools/creator/ExifStripper").then(m => ({ default: m.ExifStripper })));

const PasswordGenerator = lazy(() => import("./tools/security/PasswordGenerator").then(m => ({ default: m.PasswordGenerator })));
const PasswordStrengthChecker = lazy(() => import("./tools/security/PasswordStrengthChecker").then(m => ({ default: m.PasswordStrengthChecker })));
const LocalHashGenerator = lazy(() => import("./tools/security/LocalHashGenerator").then(m => ({ default: m.LocalHashGenerator })));
const PgpEncryptDecrypt = lazy(() => import("./tools/security/PgpEncryptDecrypt").then(m => ({ default: m.PgpEncryptDecrypt })));

const CidrSubnetCalculator = lazy(() => import("./tools/network/CidrSubnetCalculator").then(m => ({ default: m.CidrSubnetCalculator })));
const UtmLinkBuilder = lazy(() => import("./tools/network/UtmLinkBuilder").then(m => ({ default: m.UtmLinkBuilder })));
const UrlParser = lazy(() => import("./tools/network/UrlParser").then(m => ({ default: m.UrlParser })));

const SvgOptimizer = lazy(() => import("./tools/media/SvgOptimizer").then(m => ({ default: m.SvgOptimizer })));
const Base64ImageConverter = lazy(() => import("./tools/media/Base64ImageConverter").then(m => ({ default: m.Base64ImageConverter })));
const WebpConverter = lazy(() => import("./tools/media/WebpConverter").then(m => ({ default: m.WebpConverter })));

const GlassmorphismGenerator = lazy(() => import("./tools/design/GlassmorphismGenerator").then(m => ({ default: m.GlassmorphismGenerator })));
const NeumorphismGenerator = lazy(() => import("./tools/design/NeumorphismGenerator").then(m => ({ default: m.NeumorphismGenerator })));
const CssTriangleGenerator = lazy(() => import("./tools/design/CssTriangleGenerator").then(m => ({ default: m.CssTriangleGenerator })));
const SvgBlobGenerator = lazy(() => import("./tools/design/SvgBlobGenerator").then(m => ({ default: m.SvgBlobGenerator })));
const CssGradientGenerator = lazy(() => import("./tools/design/CssGradientGenerator").then(m => ({ default: m.CssGradientGenerator })));
const ColorContrastChecker = lazy(() => import("./tools/design/ColorContrastChecker").then(m => ({ default: m.ColorContrastChecker })));
const ColorPaletteGenerator = lazy(() => import("./tools/design/ColorPaletteGenerator").then(m => ({ default: m.ColorPaletteGenerator })));
const ImageToColors = lazy(() => import("./tools/design/ImageToColors").then(m => ({ default: m.ImageToColors })));
const BoxShadowGenerator = lazy(() => import("./tools/design/BoxShadowGenerator").then(m => ({ default: m.BoxShadowGenerator })));
const BorderRadiusGenerator = lazy(() => import("./tools/design/BorderRadiusGenerator").then(m => ({ default: m.BorderRadiusGenerator })));
const GradientTextGenerator = lazy(() => import("./tools/design/GradientTextGenerator").then(m => ({ default: m.GradientTextGenerator })));

export default function App() {
  React.useEffect(() => {
    console.log("Tools are being stabilized - ads will return when all tools work perfectly");
  }, []);

  return (
    <HelmetProvider>
    <Router>
      <ErrorBoundary>
        <Suspense fallback={
        <div className="flex h-screen w-full items-center justify-center text-slate-500 font-medium">
          <div className="flex items-center gap-2">
            <svg className="animate-spin h-5 w-5 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            Loading toolkit...
          </div>
        </div>
      }>
        <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="category/:categoryId" element={<Category />} />
          <Route path="privacy" element={<PrivacyPolicy />} />
          <Route path="terms" element={<TermsOfService />} />
          
          {/* Tools Routes */}
          <Route path="tool/word-counter" element={<ToolLayout toolId="word-counter"><WordCounter /></ToolLayout>} />
          <Route path="tool/character-counter" element={<ToolLayout toolId="character-counter"><WordCounter /></ToolLayout>} />
          <Route path="tool/case-converter" element={<ToolLayout toolId="case-converter"><CaseConverter /></ToolLayout>} />
          <Route path="tool/remove-duplicate-lines" element={<ToolLayout toolId="remove-duplicate-lines"><RemoveDuplicateLines /></ToolLayout>} />
          <Route path="tool/sort-lines" element={<ToolLayout toolId="sort-lines"><SortLines /></ToolLayout>} />
          <Route path="tool/reverse-lines" element={<ToolLayout toolId="reverse-lines"><ReverseLines /></ToolLayout>} />
          <Route path="tool/extract-emails" element={<ToolLayout toolId="extract-emails"><ExtractEmails /></ToolLayout>} />
          <Route path="tool/extract-urls" element={<ToolLayout toolId="extract-urls"><ExtractUrls /></ToolLayout>} />
          <Route path="tool/remove-empty-lines" element={<ToolLayout toolId="remove-empty-lines"><RemoveEmptyLines /></ToolLayout>} />
          <Route path="tool/text-compare" element={<ToolLayout toolId="text-compare"><TextCompare /></ToolLayout>} />
          <Route path="tool/find-and-replace" element={<ToolLayout toolId="find-and-replace"><FindAndReplace /></ToolLayout>} />
          <Route path="tool/csv-cleaner" element={<ToolLayout toolId="csv-cleaner"><CsvCleaner /></ToolLayout>} />
          <Route path="tool/whitespace-remover" element={<ToolLayout toolId="whitespace-remover"><WhitespaceRemover /></ToolLayout>} />
          <Route path="tool/text-formatter" element={<ToolLayout toolId="text-formatter"><TextFormatter /></ToolLayout>} />
          
          <Route path="tool/json-formatter" element={<ToolLayout toolId="json-formatter"><JsonFormatter /></ToolLayout>} />
          <Route path="tool/json-validator" element={<ToolLayout toolId="json-validator"><JsonValidator /></ToolLayout>} />
          <Route path="tool/regex-tester" element={<ToolLayout toolId="regex-tester"><RegexTester /></ToolLayout>} />
          <Route path="tool/jwt-decoder" element={<ToolLayout toolId="jwt-decoder"><JwtDecoder /></ToolLayout>} />
          <Route path="tool/jwt-inspector" element={<ToolLayout toolId="jwt-inspector"><JwtInspector /></ToolLayout>} />
          <Route path="tool/base64-encoder" element={<ToolLayout toolId="base64-encoder"><Base64Encoder /></ToolLayout>} />
          <Route path="tool/base64-decoder" element={<ToolLayout toolId="base64-decoder"><Base64Decoder /></ToolLayout>} />
          <Route path="tool/url-encoder-decoder" element={<ToolLayout toolId="url-encoder-decoder"><UrlEncoderDecoder /></ToolLayout>} />
          <Route path="tool/color-converter" element={<ToolLayout toolId="color-converter"><ColorConverter /></ToolLayout>} />
          <Route path="tool/api-tester" element={<ToolLayout toolId="api-tester"><ApiTester /></ToolLayout>} />
          <Route path="tool/uuid-generator" element={<ToolLayout toolId="uuid-generator"><UuidGenerator /></ToolLayout>} />
          <Route path="tool/hash-generator" element={<ToolLayout toolId="hash-generator"><HashGenerator /></ToolLayout>} />
          <Route path="tool/sql-formatter" element={<ToolLayout toolId="sql-formatter"><SqlFormatterTool /></ToolLayout>} />
          <Route path="tool/xml-formatter" element={<ToolLayout toolId="xml-formatter"><XmlFormatterTool /></ToolLayout>} />
          <Route path="tool/csv-to-json" element={<ToolLayout toolId="csv-to-json"><CsvToJson /></ToolLayout>} />
          <Route path="tool/json-to-csv" element={<ToolLayout toolId="json-to-csv"><JsonToCsv /></ToolLayout>} />

          <Route path="tool/profit-calculator" element={<ToolLayout toolId="profit-calculator"><ProfitCalculator /></ToolLayout>} />
          <Route path="tool/roi-calculator" element={<ToolLayout toolId="roi-calculator"><RoiCalculator /></ToolLayout>} />
          <Route path="tool/marketplace-fee-calculator" element={<ToolLayout toolId="marketplace-fee-calculator"><MarketplaceFeeCalculator /></ToolLayout>} />
          <Route path="tool/pricing-calculator" element={<ToolLayout toolId="pricing-calculator"><PricingCalculator /></ToolLayout>} />
          <Route path="tool/break-even-calculator" element={<ToolLayout toolId="break-even-calculator"><BreakEvenCalculator /></ToolLayout>} />
          <Route path="tool/margin-calculator" element={<ToolLayout toolId="margin-calculator"><MarginCalculator /></ToolLayout>} />
          <Route path="tool/discount-calculator" element={<ToolLayout toolId="discount-calculator"><DiscountCalculator /></ToolLayout>} />
          <Route path="tool/sales-tax-calculator" element={<ToolLayout toolId="sales-tax-calculator"><SalesTaxCalculator /></ToolLayout>} />
          <Route path="tool/revenue-forecast" element={<ToolLayout toolId="revenue-forecast"><RevenueForecastTool /></ToolLayout>} />
          <Route path="tool/product-cost-calculator" element={<ToolLayout toolId="product-cost-calculator"><ProductCostCalculator /></ToolLayout>} />
          
          {/* Student Toolkit Routes */}
          <Route path="tool/gpa-calculator" element={<ToolLayout toolId="gpa-calculator"><GpaCalculator /></ToolLayout>} />
          <Route path="tool/grade-calculator" element={<ToolLayout toolId="grade-calculator"><GradeCalculator /></ToolLayout>} />
          <Route path="tool/reading-time" element={<ToolLayout toolId="reading-time"><ReadingTimeCalculator /></ToolLayout>} />
          <Route path="tool/study-schedule" element={<ToolLayout toolId="study-schedule"><StudyScheduleGenerator /></ToolLayout>} />
          <Route path="tool/exam-countdown" element={<ToolLayout toolId="exam-countdown"><ExamCountdownTracker /></ToolLayout>} />
          <Route path="tool/assignment-planner" element={<ToolLayout toolId="assignment-planner"><AssignmentPlanner /></ToolLayout>} />
          <Route path="tool/semester-planner" element={<ToolLayout toolId="semester-planner"><SemesterPlanner /></ToolLayout>} />
          <Route path="tool/citation-formatter" element={<ToolLayout toolId="citation-formatter"><CitationFormatter /></ToolLayout>} />
          <Route path="tool/flashcard-exporter" element={<ToolLayout toolId="flashcard-exporter"><FlashcardExporter /></ToolLayout>} />
          <Route path="tool/note-formatter" element={<ToolLayout toolId="note-formatter"><NoteFormatter /></ToolLayout>} />

          {/* PDF Routes */}
          <Route path="tool/merge-pdf" element={<ToolLayout toolId="merge-pdf"><MergePdf /></ToolLayout>} />

          {/* Creator Toolkit Routes */}
          <Route path="tool/youtube-title-checker" element={<ToolLayout toolId="youtube-title-checker"><YoutubeTitleChecker /></ToolLayout>} />
          <Route path="tool/hashtag-generator" element={<ToolLayout toolId="hashtag-generator"><HashtagGenerator /></ToolLayout>} />
          <Route path="tool/read-time-estimator" element={<ToolLayout toolId="read-time-estimator"><ReadTimeEstimator /></ToolLayout>} />
          <Route path="tool/social-post-preview" element={<ToolLayout toolId="social-post-preview"><SocialPostPreview /></ToolLayout>} />
          <Route path="tool/video-description-template" element={<ToolLayout toolId="video-description-template"><DescriptionGenerator /></ToolLayout>} />

          {/* Gaming Toolkit Routes */}
          <Route path="tool/kd-calculator" element={<ToolLayout toolId="kd-calculator"><KdCalculator /></ToolLayout>} />
          <Route path="tool/edpi-calculator" element={<ToolLayout toolId="edpi-calculator"><EdpiCalculator /></ToolLayout>} />
          <Route path="tool/sens-converter" element={<ToolLayout toolId="sens-converter"><SensConverter /></ToolLayout>} />
          <Route path="tool/xp-calculator" element={<ToolLayout toolId="xp-calculator"><XpCalculator /></ToolLayout>} />
          <Route path="tool/aspect-ratio-calc" element={<ToolLayout toolId="aspect-ratio-calc"><AspectRatioCalc /></ToolLayout>} />

          {/* Catch all */}
          
          {/* Default Tool Routing Block for NEW tools */}
          
          {/* Dev Tools */}
          <Route path="tool/cron-job-generator" element={<ToolLayout toolId="cron-job-generator"><CronJobGenerator /></ToolLayout>} />
          <Route path="tool/yaml-json-converter" element={<ToolLayout toolId="yaml-json-converter"><YamlJsonConverter /></ToolLayout>} />
          <Route path="tool/jwt-builder" element={<ToolLayout toolId="jwt-builder"><JwtBuilder /></ToolLayout>} />
          
          {/* Text Tools */}
          <Route path="tool/markdown-to-html" element={<ToolLayout toolId="markdown-to-html"><MarkdownToHtml /></ToolLayout>} />
          <Route path="tool/diff-viewer" element={<ToolLayout toolId="diff-viewer"><DiffViewer /></ToolLayout>} />
          <Route path="tool/lorem-ipsum-generator" element={<ToolLayout toolId="lorem-ipsum-generator"><LoremIpsumGenerator /></ToolLayout>} />
          
          {/* Gaming Tools */}
          <Route path="tool/fov-converter" element={<ToolLayout toolId="fov-converter"><FovConverter /></ToolLayout>} />
          <Route path="tool/mouse-polling-checker" element={<ToolLayout toolId="mouse-polling-checker"><MousePollingChecker /></ToolLayout>} />
          <Route path="tool/reaction-time-tester" element={<ToolLayout toolId="reaction-time-tester"><ReactionTimeTester /></ToolLayout>} />
          
          {/* Student Tools */}
          <Route path="tool/pomodoro-timer" element={<ToolLayout toolId="pomodoro-timer"><PomodoroTimer /></ToolLayout>} />
          <Route path="tool/synonym-swapper" element={<ToolLayout toolId="synonym-swapper"><SynonymSwapper /></ToolLayout>} />
          <Route path="tool/interactive-flashcards" element={<ToolLayout toolId="interactive-flashcards"><InteractiveFlashcards /></ToolLayout>} />

          {/* Seller Tools */}
          <Route path="tool/local-invoice-generator" element={<ToolLayout toolId="local-invoice-generator"><LocalInvoiceGenerator /></ToolLayout>} />
          <Route path="tool/qr-barcode-generator" element={<ToolLayout toolId="qr-barcode-generator"><QrBarcodeGenerator /></ToolLayout>} />
          <Route path="tool/cpm-calculator" element={<ToolLayout toolId="cpm-calculator"><CpmCalculator /></ToolLayout>} />

          {/* Creator Tools */}
          <Route path="tool/thumbnail-safe-zone" element={<ToolLayout toolId="thumbnail-safe-zone"><ThumbnailSafeZone /></ToolLayout>} />
          <Route path="tool/exif-stripper" element={<ToolLayout toolId="exif-stripper"><ExifStripper /></ToolLayout>} />

          {/* Security & Privacy Tools */}
          <Route path="tool/password-generator" element={<ToolLayout toolId="password-generator"><PasswordGenerator /></ToolLayout>} />
          <Route path="tool/password-strength-checker" element={<ToolLayout toolId="password-strength-checker"><PasswordStrengthChecker /></ToolLayout>} />
          <Route path="tool/local-hash-generator" element={<ToolLayout toolId="local-hash-generator"><LocalHashGenerator /></ToolLayout>} />
          <Route path="tool/pgp-encrypt-decrypt" element={<ToolLayout toolId="pgp-encrypt-decrypt"><PgpEncryptDecrypt /></ToolLayout>} />

          {/* Network & Webmaster Tools */}
          <Route path="tool/cidr-subnet-calculator" element={<ToolLayout toolId="cidr-subnet-calculator"><CidrSubnetCalculator /></ToolLayout>} />
          <Route path="tool/utm-link-builder" element={<ToolLayout toolId="utm-link-builder"><UtmLinkBuilder /></ToolLayout>} />
          <Route path="tool/url-parser" element={<ToolLayout toolId="url-parser"><UrlParser /></ToolLayout>} />

          {/* Media & Image Tools */}
          <Route path="tool/svg-optimizer" element={<ToolLayout toolId="svg-optimizer"><SvgOptimizer /></ToolLayout>} />
          <Route path="tool/base64-image-converter" element={<ToolLayout toolId="base64-image-converter"><Base64ImageConverter /></ToolLayout>} />
          <Route path="tool/webp-converter" element={<ToolLayout toolId="webp-converter"><WebpConverter /></ToolLayout>} />

          {/* Design & UI Tools */}
          <Route path="tool/box-shadow-generator" element={<ToolLayout toolId="box-shadow-generator"><BoxShadowGenerator /></ToolLayout>} />
          <Route path="tool/border-radius-generator" element={<ToolLayout toolId="border-radius-generator"><BorderRadiusGenerator /></ToolLayout>} />
          <Route path="tool/gradient-text-generator" element={<ToolLayout toolId="gradient-text-generator"><GradientTextGenerator /></ToolLayout>} />
          <Route path="tool/glassmorphism-generator" element={<ToolLayout toolId="glassmorphism-generator"><GlassmorphismGenerator /></ToolLayout>} />
          <Route path="tool/neumorphism-generator" element={<ToolLayout toolId="neumorphism-generator"><NeumorphismGenerator /></ToolLayout>} />
          <Route path="tool/css-triangle-generator" element={<ToolLayout toolId="css-triangle-generator"><CssTriangleGenerator /></ToolLayout>} />
          <Route path="tool/svg-blob-generator" element={<ToolLayout toolId="svg-blob-generator"><SvgBlobGenerator /></ToolLayout>} />
          <Route path="tool/css-gradient-generator" element={<ToolLayout toolId="css-gradient-generator"><CssGradientGenerator /></ToolLayout>} />
          <Route path="tool/color-contrast-checker" element={<ToolLayout toolId="color-contrast-checker"><ColorContrastChecker /></ToolLayout>} />
          <Route path="tool/color-palette-generator" element={<ToolLayout toolId="color-palette-generator"><ColorPaletteGenerator /></ToolLayout>} />
          <Route path="tool/image-to-colors" element={<ToolLayout toolId="image-to-colors"><ImageToColors /></ToolLayout>} />

          <Route path="*" element={<div className="container mx-auto p-20 text-center">Page not found</div>} />
        </Route>
      </Routes>
        </Suspense>
      </ErrorBoundary>
      <DebugPanel />
    </Router>
    </HelmetProvider>
  );
}


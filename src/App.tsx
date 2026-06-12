import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { Layout } from "./components/layout/Layout";
import { ToolLayout } from "./components/layout/ToolLayout";

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
const RotatePdf = lazy(() => import("./tools/pdf/PdfModifiers1").then(m => ({ default: m.RotatePdf })));
const DeletePagesPdf = lazy(() => import("./tools/pdf/PdfModifiers1").then(m => ({ default: m.DeletePagesPdf })));
const ExtractPagesPdf = lazy(() => import("./tools/pdf/PdfModifiers1").then(m => ({ default: m.ExtractPagesPdf })));
const AddWatermarkPdf = lazy(() => import("./tools/pdf/PdfModifiers2").then(m => ({ default: m.AddWatermarkPdf })));
const AddPageNumbersPdf = lazy(() => import("./tools/pdf/PdfModifiers2").then(m => ({ default: m.AddPageNumbersPdf })));
const ReorderPdf = lazy(() => import("./tools/pdf/PdfModifiers2").then(m => ({ default: m.ReorderPdf })));
const JpgToPdf = lazy(() => import("./tools/pdf/PdfConverters").then(m => ({ default: m.JpgToPdf })));
const PngToPdf = lazy(() => import("./tools/pdf/PdfConverters").then(m => ({ default: m.PngToPdf })));
const PdfToJpg = lazy(() => import("./tools/pdf/PdfConverters").then(m => ({ default: m.PdfToJpg })));
const PdfToPng = lazy(() => import("./tools/pdf/PdfConverters").then(m => ({ default: m.PdfToPng })));
const PdfToText = lazy(() => import("./tools/pdf/PdfConverters").then(m => ({ default: m.PdfToText })));
const CompressPdf = lazy(() => import("./tools/pdf/PdfConverters").then(m => ({ default: m.CompressPdf })));
const ProtectPdf = lazy(() => import("./tools/pdf/PdfConverters").then(m => ({ default: m.ProtectPdf })));
const UnlockPdf = lazy(() => import("./tools/pdf/PdfConverters").then(m => ({ default: m.UnlockPdf })));
const SplitPdf = lazy(() => import("./tools/pdf/PdfAdvanced").then(m => ({ default: m.SplitPdf })));
const PdfMetadataViewer = lazy(() => import("./tools/pdf/PdfAdvanced").then(m => ({ default: m.PdfMetadataViewer })));

const AlternateMixPdf = lazy(() => import("./tools/pdf/PdfPlaceholders").then(m => ({ default: m.AlternateMixPdf })));
const SplitPdfByPages = lazy(() => import("./tools/pdf/PdfPlaceholders").then(m => ({ default: m.SplitPdfByPages })));
const SplitPdfByBookmarks = lazy(() => import("./tools/pdf/PdfPlaceholders").then(m => ({ default: m.SplitPdfByBookmarks })));
const SplitPdfInHalf = lazy(() => import("./tools/pdf/PdfPlaceholders").then(m => ({ default: m.SplitPdfInHalf })));
const SplitPdfBySize = lazy(() => import("./tools/pdf/PdfPlaceholders").then(m => ({ default: m.SplitPdfBySize })));
const SplitPdfByText = lazy(() => import("./tools/pdf/PdfPlaceholders").then(m => ({ default: m.SplitPdfByText })));
const EditPdf = lazy(() => import("./tools/pdf/PdfPlaceholders").then(m => ({ default: m.EditPdf })));
const FillSignPdf = lazy(() => import("./tools/pdf/PdfPlaceholders").then(m => ({ default: m.FillSignPdf })));
const CreateFormsPdf = lazy(() => import("./tools/pdf/PdfPlaceholders").then(m => ({ default: m.CreateFormsPdf })));
const FlattenPdf = lazy(() => import("./tools/pdf/PdfPlaceholders").then(m => ({ default: m.FlattenPdf })));
const PdfToExcel = lazy(() => import("./tools/pdf/PdfPlaceholders").then(m => ({ default: m.PdfToExcel })));
const PdfToPpt = lazy(() => import("./tools/pdf/PdfPlaceholders").then(m => ({ default: m.PdfToPpt })));
const PdfToWord = lazy(() => import("./tools/pdf/PdfPlaceholders").then(m => ({ default: m.PdfToWord })));
const HtmlToPdf = lazy(() => import("./tools/pdf/PdfPlaceholders").then(m => ({ default: m.HtmlToPdf })));
const WordToPdf = lazy(() => import("./tools/pdf/PdfPlaceholders").then(m => ({ default: m.WordToPdf })));
const BatesNumbering = lazy(() => import("./tools/pdf/PdfPlaceholders").then(m => ({ default: m.BatesNumbering })));
const CreateBookmarksPdf = lazy(() => import("./tools/pdf/PdfPlaceholders").then(m => ({ default: m.CreateBookmarksPdf })));
const CropPdf = lazy(() => import("./tools/pdf/CropPdf").then(m => ({ default: m.CropPdf })));
const ExtractImagesPdf = lazy(() => import("./tools/pdf/PdfPlaceholders").then(m => ({ default: m.ExtractImagesPdf })));
const GrayscalePdf = lazy(() => import("./tools/pdf/PdfPlaceholders").then(m => ({ default: m.GrayscalePdf })));
const HeaderFooterPdf = lazy(() => import("./tools/pdf/PdfPlaceholders").then(m => ({ default: m.HeaderFooterPdf })));
const NUpPdf = lazy(() => import("./tools/pdf/PdfPlaceholders").then(m => ({ default: m.NUpPdf })));
const RenamePdf = lazy(() => import("./tools/pdf/PdfPlaceholders").then(m => ({ default: m.RenamePdf })));
const RepairPdf = lazy(() => import("./tools/pdf/PdfPlaceholders").then(m => ({ default: m.RepairPdf })));
const ResizePdf = lazy(() => import("./tools/pdf/PdfPlaceholders").then(m => ({ default: m.ResizePdf })));
const RemoveAnnotationsPdf = lazy(() => import("./tools/pdf/PdfPlaceholders").then(m => ({ default: m.RemoveAnnotationsPdf })));
const DeskewPdf = lazy(() => import("./tools/pdf/PdfPlaceholders").then(m => ({ default: m.DeskewPdf })));
const OcrPdf = lazy(() => import("./tools/pdf/PdfPlaceholders").then(m => ({ default: m.OcrPdf })));
const AutomatePdf = lazy(() => import("./tools/pdf/PdfPlaceholders").then(m => ({ default: m.AutomatePdf })));

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
const PdfMetadataEditor = lazy(() => import("./tools/pdf/PdfMetadataEditor").then(m => ({ default: m.PdfMetadataEditor })));
const PdfRedactor = lazy(() => import("./tools/pdf/PdfRedactor").then(m => ({ default: m.PdfRedactor })));
const ComparePdfs = lazy(() => import("./tools/pdf/ComparePdfs").then(m => ({ default: m.ComparePdfs })));
const PdfEditor = lazy(() => import("./tools/pdf/PdfEditor").then(m => ({ default: m.PdfEditor })));

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
  return (
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
          <Route path="text/word-counter" element={<ToolLayout toolId="word-counter"><WordCounter /></ToolLayout>} />
          <Route path="text/character-counter" element={<ToolLayout toolId="character-counter"><WordCounter /></ToolLayout>} />
          <Route path="text/case-converter" element={<ToolLayout toolId="case-converter"><CaseConverter /></ToolLayout>} />
          <Route path="text/remove-duplicate-lines" element={<ToolLayout toolId="remove-duplicate-lines"><RemoveDuplicateLines /></ToolLayout>} />
          <Route path="text/sort-lines" element={<ToolLayout toolId="sort-lines"><SortLines /></ToolLayout>} />
          <Route path="text/reverse-lines" element={<ToolLayout toolId="reverse-lines"><ReverseLines /></ToolLayout>} />
          <Route path="text/extract-emails" element={<ToolLayout toolId="extract-emails"><ExtractEmails /></ToolLayout>} />
          <Route path="text/extract-urls" element={<ToolLayout toolId="extract-urls"><ExtractUrls /></ToolLayout>} />
          <Route path="text/remove-empty-lines" element={<ToolLayout toolId="remove-empty-lines"><RemoveEmptyLines /></ToolLayout>} />
          <Route path="text/text-compare" element={<ToolLayout toolId="text-compare"><TextCompare /></ToolLayout>} />
          <Route path="text/find-and-replace" element={<ToolLayout toolId="find-and-replace"><FindAndReplace /></ToolLayout>} />
          <Route path="text/csv-cleaner" element={<ToolLayout toolId="csv-cleaner"><CsvCleaner /></ToolLayout>} />
          <Route path="text/whitespace-remover" element={<ToolLayout toolId="whitespace-remover"><WhitespaceRemover /></ToolLayout>} />
          <Route path="text/text-formatter" element={<ToolLayout toolId="text-formatter"><TextFormatter /></ToolLayout>} />
          
          <Route path="dev/json-formatter" element={<ToolLayout toolId="json-formatter"><JsonFormatter /></ToolLayout>} />
          <Route path="dev/json-validator" element={<ToolLayout toolId="json-validator"><JsonValidator /></ToolLayout>} />
          <Route path="dev/regex-tester" element={<ToolLayout toolId="regex-tester"><RegexTester /></ToolLayout>} />
          <Route path="dev/jwt-decoder" element={<ToolLayout toolId="jwt-decoder"><JwtDecoder /></ToolLayout>} />
          <Route path="dev/jwt-inspector" element={<ToolLayout toolId="jwt-inspector"><JwtInspector /></ToolLayout>} />
          <Route path="dev/base64-encoder" element={<ToolLayout toolId="base64-encoder"><Base64Encoder /></ToolLayout>} />
          <Route path="dev/base64-decoder" element={<ToolLayout toolId="base64-decoder"><Base64Decoder /></ToolLayout>} />
          <Route path="dev/url-encoder" element={<ToolLayout toolId="url-encoder-decoder"><UrlEncoderDecoder /></ToolLayout>} />
          <Route path="dev/color-converter" element={<ToolLayout toolId="color-converter"><ColorConverter /></ToolLayout>} />
          <Route path="dev/api-tester" element={<ToolLayout toolId="api-tester"><ApiTester /></ToolLayout>} />
          <Route path="dev/uuid" element={<ToolLayout toolId="uuid-generator"><UuidGenerator /></ToolLayout>} />
          <Route path="dev/hash-generator" element={<ToolLayout toolId="hash-generator"><HashGenerator /></ToolLayout>} />
          <Route path="dev/sql-formatter" element={<ToolLayout toolId="sql-formatter"><SqlFormatterTool /></ToolLayout>} />
          <Route path="dev/xml-formatter" element={<ToolLayout toolId="xml-formatter"><XmlFormatterTool /></ToolLayout>} />
          <Route path="dev/csv-to-json" element={<ToolLayout toolId="csv-to-json"><CsvToJson /></ToolLayout>} />
          <Route path="dev/json-to-csv" element={<ToolLayout toolId="json-to-csv"><JsonToCsv /></ToolLayout>} />

          <Route path="seller/profit-calculator" element={<ToolLayout toolId="profit-calculator"><ProfitCalculator /></ToolLayout>} />
          <Route path="seller/roi-calculator" element={<ToolLayout toolId="roi-calculator"><RoiCalculator /></ToolLayout>} />
          <Route path="seller/marketplace-fee-calculator" element={<ToolLayout toolId="marketplace-fee-calculator"><MarketplaceFeeCalculator /></ToolLayout>} />
          <Route path="seller/pricing-calculator" element={<ToolLayout toolId="pricing-calculator"><PricingCalculator /></ToolLayout>} />
          <Route path="seller/break-even-calculator" element={<ToolLayout toolId="break-even-calculator"><BreakEvenCalculator /></ToolLayout>} />
          <Route path="seller/margin-calculator" element={<ToolLayout toolId="margin-calculator"><MarginCalculator /></ToolLayout>} />
          <Route path="seller/discount-calculator" element={<ToolLayout toolId="discount-calculator"><DiscountCalculator /></ToolLayout>} />
          <Route path="seller/sales-tax-calculator" element={<ToolLayout toolId="sales-tax-calculator"><SalesTaxCalculator /></ToolLayout>} />
          <Route path="seller/revenue-forecast" element={<ToolLayout toolId="revenue-forecast"><RevenueForecastTool /></ToolLayout>} />
          <Route path="seller/product-cost-calculator" element={<ToolLayout toolId="product-cost-calculator"><ProductCostCalculator /></ToolLayout>} />
          
          {/* Student Toolkit Routes */}
          <Route path="student/gpa-calculator" element={<ToolLayout toolId="gpa-calculator"><GpaCalculator /></ToolLayout>} />
          <Route path="student/grade-calculator" element={<ToolLayout toolId="grade-calculator"><GradeCalculator /></ToolLayout>} />
          <Route path="student/reading-time" element={<ToolLayout toolId="reading-time"><ReadingTimeCalculator /></ToolLayout>} />
          <Route path="student/study-schedule" element={<ToolLayout toolId="study-schedule"><StudyScheduleGenerator /></ToolLayout>} />
          <Route path="student/exam-countdown" element={<ToolLayout toolId="exam-countdown"><ExamCountdownTracker /></ToolLayout>} />
          <Route path="student/assignment-planner" element={<ToolLayout toolId="assignment-planner"><AssignmentPlanner /></ToolLayout>} />
          <Route path="student/semester-planner" element={<ToolLayout toolId="semester-planner"><SemesterPlanner /></ToolLayout>} />
          <Route path="student/citation-formatter" element={<ToolLayout toolId="citation-formatter"><CitationFormatter /></ToolLayout>} />
          <Route path="student/flashcard-exporter" element={<ToolLayout toolId="flashcard-exporter"><FlashcardExporter /></ToolLayout>} />
          <Route path="student/note-formatter" element={<ToolLayout toolId="note-formatter"><NoteFormatter /></ToolLayout>} />

          {/* PDF Routes */}
          <Route path="pdf/merge" element={<ToolLayout toolId="merge-pdf"><MergePdf /></ToolLayout>} />
          <Route path="pdf/split" element={<ToolLayout toolId="split-pdf"><SplitPdf /></ToolLayout>} />
          <Route path="pdf/compress" element={<ToolLayout toolId="compress-pdf"><CompressPdf /></ToolLayout>} />
          <Route path="pdf/rotate" element={<ToolLayout toolId="rotate-pdf"><RotatePdf /></ToolLayout>} />
          <Route path="pdf/reorder" element={<ToolLayout toolId="reorder-pdf"><ReorderPdf /></ToolLayout>} />
          <Route path="pdf/extract" element={<ToolLayout toolId="extract-pdf"><ExtractPagesPdf /></ToolLayout>} />
          <Route path="pdf/delete" element={<ToolLayout toolId="delete-pdf"><DeletePagesPdf /></ToolLayout>} />
          <Route path="pdf/watermark" element={<ToolLayout toolId="watermark-pdf"><AddWatermarkPdf /></ToolLayout>} />
          <Route path="pdf/page-numbers" element={<ToolLayout toolId="page-numbers-pdf"><AddPageNumbersPdf /></ToolLayout>} />
          <Route path="pdf/protect" element={<ToolLayout toolId="protect-pdf"><ProtectPdf /></ToolLayout>} />
          <Route path="pdf/unlock" element={<ToolLayout toolId="unlock-pdf"><UnlockPdf /></ToolLayout>} />
          <Route path="pdf/to-jpg" element={<ToolLayout toolId="pdf-to-jpg"><PdfToJpg /></ToolLayout>} />
          <Route path="pdf/jpg-to-pdf" element={<ToolLayout toolId="jpg-to-pdf"><JpgToPdf /></ToolLayout>} />
          <Route path="pdf/png-to-pdf" element={<ToolLayout toolId="png-to-pdf"><PngToPdf /></ToolLayout>} />
          <Route path="pdf/to-png" element={<ToolLayout toolId="pdf-to-png"><PdfToPng /></ToolLayout>} />
          <Route path="pdf/to-text" element={<ToolLayout toolId="pdf-to-text"><PdfToText /></ToolLayout>} />
          <Route path="pdf/metadata" element={<ToolLayout toolId="pdf-metadata"><PdfMetadataViewer /></ToolLayout>} />
          <Route path="pdf/alternate-mix" element={<ToolLayout toolId="alternate-mix-pdf"><AlternateMixPdf /></ToolLayout>} />
          <Route path="pdf/split-by-pages" element={<ToolLayout toolId="split-by-pages"><SplitPdfByPages /></ToolLayout>} />
          <Route path="pdf/split-by-bookmarks" element={<ToolLayout toolId="split-by-bookmarks"><SplitPdfByBookmarks /></ToolLayout>} />
          <Route path="pdf/split-in-half" element={<ToolLayout toolId="split-in-half"><SplitPdfInHalf /></ToolLayout>} />
          <Route path="pdf/split-by-size" element={<ToolLayout toolId="split-by-size"><SplitPdfBySize /></ToolLayout>} />
          <Route path="pdf/split-by-text" element={<ToolLayout toolId="split-by-text"><SplitPdfByText /></ToolLayout>} />
          <Route path="pdf/edit" element={<ToolLayout toolId="edit-pdf"><PdfEditor /></ToolLayout>} />
          <Route path="pdf/fill-sign" element={<ToolLayout toolId="fill-sign-pdf"><FillSignPdf /></ToolLayout>} />
          <Route path="pdf/create-forms" element={<ToolLayout toolId="create-forms-pdf"><CreateFormsPdf /></ToolLayout>} />
          <Route path="pdf/flatten" element={<ToolLayout toolId="flatten-pdf"><FlattenPdf /></ToolLayout>} />
          <Route path="pdf/to-excel" element={<ToolLayout toolId="pdf-to-excel"><PdfToExcel /></ToolLayout>} />
          <Route path="pdf/to-ppt" element={<ToolLayout toolId="pdf-to-ppt"><PdfToPpt /></ToolLayout>} />
          <Route path="pdf/to-word" element={<ToolLayout toolId="pdf-to-word"><PdfToWord /></ToolLayout>} />
          <Route path="pdf/html-to-pdf" element={<ToolLayout toolId="html-to-pdf"><HtmlToPdf /></ToolLayout>} />
          <Route path="pdf/word-to-pdf" element={<ToolLayout toolId="word-to-pdf"><WordToPdf /></ToolLayout>} />
          <Route path="pdf/bates-numbering" element={<ToolLayout toolId="bates-numbering"><BatesNumbering /></ToolLayout>} />
          <Route path="pdf/create-bookmarks" element={<ToolLayout toolId="create-bookmarks"><CreateBookmarksPdf /></ToolLayout>} />
          <Route path="pdf/crop" element={<ToolLayout toolId="crop-pdf"><CropPdf /></ToolLayout>} />
          <Route path="pdf/extract-images" element={<ToolLayout toolId="extract-images-pdf"><ExtractImagesPdf /></ToolLayout>} />
          <Route path="pdf/grayscale" element={<ToolLayout toolId="grayscale-pdf"><GrayscalePdf /></ToolLayout>} />
          <Route path="pdf/header-footer" element={<ToolLayout toolId="header-footer-pdf"><HeaderFooterPdf /></ToolLayout>} />
          <Route path="pdf/n-up" element={<ToolLayout toolId="n-up-pdf"><NUpPdf /></ToolLayout>} />
          <Route path="pdf/rename" element={<ToolLayout toolId="rename-pdf"><RenamePdf /></ToolLayout>} />
          <Route path="pdf/repair" element={<ToolLayout toolId="repair-pdf"><RepairPdf /></ToolLayout>} />
          <Route path="pdf/resize" element={<ToolLayout toolId="resize-pdf"><ResizePdf /></ToolLayout>} />
          <Route path="pdf/remove-annotations" element={<ToolLayout toolId="remove-annotations-pdf"><RemoveAnnotationsPdf /></ToolLayout>} />
          <Route path="pdf/deskew" element={<ToolLayout toolId="deskew-pdf"><DeskewPdf /></ToolLayout>} />
          <Route path="pdf/ocr" element={<ToolLayout toolId="ocr-pdf"><OcrPdf /></ToolLayout>} />
          <Route path="pdf/automate" element={<ToolLayout toolId="automate-pdf"><AutomatePdf /></ToolLayout>} />

          {/* Creator Toolkit Routes */}
          <Route path="creator/youtube-title" element={<ToolLayout toolId="youtube-title-checker"><YoutubeTitleChecker /></ToolLayout>} />
          <Route path="creator/hashtags" element={<ToolLayout toolId="hashtag-generator"><HashtagGenerator /></ToolLayout>} />
          <Route path="creator/read-time" element={<ToolLayout toolId="read-time-estimator"><ReadTimeEstimator /></ToolLayout>} />
          <Route path="creator/social-preview" element={<ToolLayout toolId="social-post-preview"><SocialPostPreview /></ToolLayout>} />
          <Route path="creator/description-template" element={<ToolLayout toolId="video-description-template"><DescriptionGenerator /></ToolLayout>} />

          {/* Gaming Toolkit Routes */}
          <Route path="gaming/kd-calculator" element={<ToolLayout toolId="kd-calculator"><KdCalculator /></ToolLayout>} />
          <Route path="gaming/edpi-calculator" element={<ToolLayout toolId="edpi-calculator"><EdpiCalculator /></ToolLayout>} />
          <Route path="gaming/sens-converter" element={<ToolLayout toolId="sens-converter"><SensConverter /></ToolLayout>} />
          <Route path="gaming/xp-calculator" element={<ToolLayout toolId="xp-calculator"><XpCalculator /></ToolLayout>} />
          <Route path="gaming/aspect-ratio" element={<ToolLayout toolId="aspect-ratio-calc"><AspectRatioCalc /></ToolLayout>} />

          {/* Catch all */}
          
          {/* Default Tool Routing Block for NEW tools */}
          {/* PDF Tools */}
          <Route path="pdf/metadata-editor" element={<ToolLayout toolId="pdf-metadata-editor"><PdfMetadataEditor /></ToolLayout>} />
          <Route path="pdf/redactor" element={<ToolLayout toolId="pdf-redactor"><PdfRedactor /></ToolLayout>} />
          <Route path="pdf/compare" element={<ToolLayout toolId="compare-pdfs"><ComparePdfs /></ToolLayout>} />
          <Route path="pdf/editor" element={<ToolLayout toolId="pdf-editor"><PdfEditor /></ToolLayout>} />
          
          {/* Dev Tools */}
          <Route path="dev/cron-generator" element={<ToolLayout toolId="cron-job-generator"><CronJobGenerator /></ToolLayout>} />
          <Route path="dev/yaml-json" element={<ToolLayout toolId="yaml-json-converter"><YamlJsonConverter /></ToolLayout>} />
          <Route path="dev/jwt-builder" element={<ToolLayout toolId="jwt-builder"><JwtBuilder /></ToolLayout>} />
          
          {/* Text Tools */}
          <Route path="text/markdown-html" element={<ToolLayout toolId="markdown-to-html"><MarkdownToHtml /></ToolLayout>} />
          <Route path="text/diff-viewer" element={<ToolLayout toolId="diff-viewer"><DiffViewer /></ToolLayout>} />
          <Route path="text/lorem-ipsum" element={<ToolLayout toolId="lorem-ipsum-generator"><LoremIpsumGenerator /></ToolLayout>} />
          
          {/* Gaming Tools */}
          <Route path="gaming/fov-converter" element={<ToolLayout toolId="fov-converter"><FovConverter /></ToolLayout>} />
          <Route path="gaming/mouse-polling" element={<ToolLayout toolId="mouse-polling-checker"><MousePollingChecker /></ToolLayout>} />
          <Route path="gaming/reaction-time" element={<ToolLayout toolId="reaction-time-tester"><ReactionTimeTester /></ToolLayout>} />
          
          {/* Student Tools */}
          <Route path="student/pomodoro" element={<ToolLayout toolId="pomodoro-timer"><PomodoroTimer /></ToolLayout>} />
          <Route path="student/synonym-swapper" element={<ToolLayout toolId="synonym-swapper"><SynonymSwapper /></ToolLayout>} />
          <Route path="student/flashcards" element={<ToolLayout toolId="interactive-flashcards"><InteractiveFlashcards /></ToolLayout>} />

          {/* Seller Tools */}
          <Route path="seller/invoice-generator" element={<ToolLayout toolId="local-invoice-generator"><LocalInvoiceGenerator /></ToolLayout>} />
          <Route path="seller/qr-barcode" element={<ToolLayout toolId="qr-barcode-generator"><QrBarcodeGenerator /></ToolLayout>} />
          <Route path="seller/cpm-calculator" element={<ToolLayout toolId="cpm-calculator"><CpmCalculator /></ToolLayout>} />

          {/* Creator Tools */}
          <Route path="creator/thumbnail-safe-zone" element={<ToolLayout toolId="thumbnail-safe-zone"><ThumbnailSafeZone /></ToolLayout>} />
          <Route path="creator/exif-stripper" element={<ToolLayout toolId="exif-stripper"><ExifStripper /></ToolLayout>} />

          {/* Security & Privacy Tools */}
          <Route path="security/password-generator" element={<ToolLayout toolId="password-generator"><PasswordGenerator /></ToolLayout>} />
          <Route path="security/password-strength" element={<ToolLayout toolId="password-strength-checker"><PasswordStrengthChecker /></ToolLayout>} />
          <Route path="security/hash-generator" element={<ToolLayout toolId="local-hash-generator"><LocalHashGenerator /></ToolLayout>} />
          <Route path="security/pgp" element={<ToolLayout toolId="pgp-encrypt-decrypt"><PgpEncryptDecrypt /></ToolLayout>} />

          {/* Network & Webmaster Tools */}
          <Route path="network/cidr-calculator" element={<ToolLayout toolId="cidr-subnet-calculator"><CidrSubnetCalculator /></ToolLayout>} />
          <Route path="network/utm-builder" element={<ToolLayout toolId="utm-link-builder"><UtmLinkBuilder /></ToolLayout>} />
          <Route path="network/url-parser" element={<ToolLayout toolId="url-parser"><UrlParser /></ToolLayout>} />

          {/* Media & Image Tools */}
          <Route path="media/svg-optimizer" element={<ToolLayout toolId="svg-optimizer"><SvgOptimizer /></ToolLayout>} />
          <Route path="media/base64-converter" element={<ToolLayout toolId="base64-image-converter"><Base64ImageConverter /></ToolLayout>} />
          <Route path="media/webp-converter" element={<ToolLayout toolId="webp-converter"><WebpConverter /></ToolLayout>} />

          {/* Design & UI Tools */}
          <Route path="design/box-shadow" element={<ToolLayout toolId="box-shadow-generator"><BoxShadowGenerator /></ToolLayout>} />
          <Route path="design/border-radius" element={<ToolLayout toolId="border-radius-generator"><BorderRadiusGenerator /></ToolLayout>} />
          <Route path="design/gradient-text" element={<ToolLayout toolId="gradient-text-generator"><GradientTextGenerator /></ToolLayout>} />
          <Route path="design/glassmorphism" element={<ToolLayout toolId="glassmorphism-generator"><GlassmorphismGenerator /></ToolLayout>} />
          <Route path="design/neumorphism" element={<ToolLayout toolId="neumorphism-generator"><NeumorphismGenerator /></ToolLayout>} />
          <Route path="design/css-triangle" element={<ToolLayout toolId="css-triangle-generator"><CssTriangleGenerator /></ToolLayout>} />
          <Route path="design/svg-blob" element={<ToolLayout toolId="svg-blob-generator"><SvgBlobGenerator /></ToolLayout>} />
          <Route path="design/css-gradient" element={<ToolLayout toolId="css-gradient-generator"><CssGradientGenerator /></ToolLayout>} />
          <Route path="design/color-contrast" element={<ToolLayout toolId="color-contrast-checker"><ColorContrastChecker /></ToolLayout>} />
          <Route path="design/color-palette" element={<ToolLayout toolId="color-palette-generator"><ColorPaletteGenerator /></ToolLayout>} />
          <Route path="design/image-to-colors" element={<ToolLayout toolId="image-to-colors"><ImageToColors /></ToolLayout>} />

          <Route path="*" element={<div className="container mx-auto p-20 text-center">Page not found</div>} />
        </Route>
      </Routes>
        </Suspense>
      </ErrorBoundary>
    </Router>
  );
}


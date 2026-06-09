import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { ToolLayout } from "./components/layout/ToolLayout";

// Pages
import { Home } from "./pages/Home";
import { Category } from "./pages/Category";

// Tools
import { WordCounter } from "./tools/text/WordCounter";
import { RemoveDuplicateLines, SortLines, ReverseLines, CaseConverter, ExtractEmails, ExtractUrls, RemoveEmptyLines, WhitespaceRemover } from "./tools/text/TextModifiers";
import { TextCompare, FindAndReplace, CsvCleaner, TextFormatter } from "./tools/text/TextToolsExtra";
import { JsonFormatter } from "./tools/dev/JsonFormatter";
import { Base64Encoder } from "./tools/dev/Base64Encoder";
import { ProfitCalculator } from "./tools/seller/ProfitCalculator";
import { 
  RoiCalculator, 
  MarketplaceFeeCalculator, 
  PricingCalculator, 
  BreakEvenCalculator, 
  MarginCalculator, 
  DiscountCalculator, 
  SalesTaxCalculator, 
  RevenueForecastTool, 
  ProductCostCalculator 
} from "./tools/seller/SellerCalculators";

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
import { GpaCalculator, GradeCalculator, ReadingTimeCalculator } from "./tools/student/Calculators";
import { StudyScheduleGenerator, ExamCountdownTracker, AssignmentPlanner, SemesterPlanner } from "./tools/student/Planners";
import { CitationFormatter, FlashcardExporter, NoteFormatter } from "./tools/student/Formatters";

// PDF Tools
import { MergePdf } from "./tools/pdf/MergePdf";
import { RotatePdf, DeletePagesPdf, ExtractPagesPdf } from "./tools/pdf/PdfModifiers1";
import { AddWatermarkPdf, AddPageNumbersPdf, ReorderPdf } from "./tools/pdf/PdfModifiers2";
import { JpgToPdf, PngToPdf, PdfToJpg, PdfToPng, PdfToText, CompressPdf, ProtectPdf, UnlockPdf } from "./tools/pdf/PdfConverters";
import { SplitPdf, PdfMetadataViewer } from "./tools/pdf/PdfAdvanced";
import { AlternateMixPdf, SplitPdfByPages, SplitPdfByBookmarks, SplitPdfInHalf, SplitPdfBySize, SplitPdfByText, EditPdf, FillSignPdf, CreateFormsPdf, FlattenPdf, PdfToExcel, PdfToPpt, PdfToWord, HtmlToPdf, WordToPdf, BatesNumbering, CreateBookmarksPdf, CropPdf, ExtractImagesPdf, GrayscalePdf, HeaderFooterPdf, NUpPdf, RenamePdf, RepairPdf, ResizePdf, RemoveAnnotationsPdf, DeskewPdf, OcrPdf, AutomatePdf } from "./tools/pdf/PdfPlaceholders";

// Creator & Gaming
import { YoutubeTitleChecker, HashtagGenerator, ReadTimeEstimator, SocialPostPreview, DescriptionGenerator } from "./tools/creator/CreatorTools";
import { KdCalculator, EdpiCalculator, SensConverter, XpCalculator, AspectRatioCalc } from "./tools/gaming/GamingTools";

export default function App() {
  return (
    <Router>
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
          <Route path="pdf/edit" element={<ToolLayout toolId="edit-pdf"><EditPdf /></ToolLayout>} />
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
          <Route path="*" element={<div className="container mx-auto p-20 text-center">Page not found</div>} />
        </Route>
      </Routes>
      </Suspense>
    </Router>
  );
}


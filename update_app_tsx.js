import fs from 'fs';

const toolsTs = fs.readFileSync('src/data/tools.ts', 'utf-8');
let appTsx = fs.readFileSync('src/App.tsx', 'utf-8');

const toolIdsMatch = toolsTs.matchAll(/id: "([^"]+)"/g);
const toolIds = [...toolIdsMatch].map(m => m[1]);

let missing = [];
for (const id of toolIds) {
  if (!appTsx.includes(`toolId="${id}"`)) {
    missing.push(id);
  }
}

console.log("Missing Tools: ", missing);

// We need to map tool id to component name and file path.
// Then inject the lazy import.
// Then inject the Route.

const filePaths = [
    { file: './tools/pdf/PdfModifiers1', exports: ['RotatePdf', 'DeletePagesPdf', 'ExtractPagesPdf'] },
    { file: './tools/pdf/PdfModifiers2', exports: ['AddWatermarkPdf', 'AddPageNumbersPdf', 'ReorderPdf'] },
    { file: './tools/pdf/PdfConverters', exports: ['ImageToPdf', 'JpgToPdf', 'PngToPdf', 'PdfToJpg', 'PdfToPng', 'PdfToText', 'CompressPdf', 'ProtectPdf', 'UnlockPdf'] },
    { file: './tools/pdf/PdfAdvanced', exports: ['SplitPdf', 'PdfMetadataViewer'] },
    { file: './tools/pdf/MergePdf', exports: ['MergePdf'] },
    { file: './tools/pdf/PdfEditor', exports: ['PdfEditor'] },
    { file: './tools/pdf/PdfRedactor', exports: ['PdfRedactor'] },
    { file: './tools/pdf/ComparePdfs', exports: ['ComparePdfs'] },
    { file: './tools/pdf/PdfMetadataEditor', exports: ['PdfMetadataEditor'] },
    { file: './tools/pdf/CropPdf', exports: ['CropPdf'] },
    { file: './tools/design/ColorPicker', exports: ['ColorPicker'] },
    { file: './tools/pdf/PdfPlaceholders', exports: [
        'AlternateMixPdf', 'FlattenPdf', 'SplitPdfByPages', 'SplitPdfByBookmarks', 
        'SplitPdfInHalf', 'SplitPdfBySize', 'SplitPdfByText', 'EditPdf', 'FillSignPdf', 
        'CreateFormsPdf', 'PdfToExcel', 'PdfToPpt', 'PdfToWord', 'HtmlToPdf', 'WordToPdf', 
        'BatesNumbering', 'CreateBookmarksPdf', 'ExtractImagesPdf', 'GrayscalePdf', 
        'HeaderFooterPdf', 'NUpPdf', 'RenamePdf', 'RepairPdf', 'ResizePdf', 'RemoveAnnotationsPdf', 
        'DeskewPdf', 'OcrPdf', 'AutomatePdf'
    ] }
];

// Mapping id to component name
const idToComponentMap = {
    'split-pdf': 'SplitPdf',
    'compress-pdf': 'CompressPdf',
    'rotate-pdf': 'RotatePdf',
    'reorder-pdf': 'ReorderPdf',
    'extract-pdf': 'ExtractPagesPdf',
    'delete-pdf': 'DeletePagesPdf',
    'watermark-pdf': 'AddWatermarkPdf',
    'page-numbers-pdf': 'AddPageNumbersPdf',
    'protect-pdf': 'ProtectPdf',
    'unlock-pdf': 'UnlockPdf',
    'pdf-to-jpg': 'PdfToJpg',
    'jpg-to-pdf': 'JpgToPdf',
    'png-to-pdf': 'PngToPdf',
    'pdf-to-png': 'PdfToPng',
    'pdf-to-text': 'PdfToText',
    'pdf-metadata': 'PdfMetadataViewer',
    'alternate-mix-pdf': 'AlternateMixPdf',
    'split-by-pages': 'SplitPdfByPages',
    'split-by-bookmarks': 'SplitPdfByBookmarks',
    'split-in-half': 'SplitPdfInHalf',
    'split-by-size': 'SplitPdfBySize',
    'split-by-text': 'SplitPdfByText',
    'edit-pdf': 'EditPdf',
    'fill-sign-pdf': 'FillSignPdf',
    'create-forms-pdf': 'CreateFormsPdf',
    'flatten-pdf': 'FlattenPdf',
    'pdf-to-excel': 'PdfToExcel',
    'pdf-to-ppt': 'PdfToPpt',
    'pdf-to-word': 'PdfToWord',
    'html-to-pdf': 'HtmlToPdf',
    'word-to-pdf': 'WordToPdf',
    'bates-numbering': 'BatesNumbering',
    'create-bookmarks': 'CreateBookmarksPdf',
    'crop-pdf': 'CropPdf',
    'extract-images-pdf': 'ExtractImagesPdf',
    'grayscale-pdf': 'GrayscalePdf',
    'header-footer-pdf': 'HeaderFooterPdf',
    'n-up-pdf': 'NUpPdf',
    'rename-pdf': 'RenamePdf',
    'repair-pdf': 'RepairPdf',
    'resize-pdf': 'ResizePdf',
    'remove-annotations-pdf': 'RemoveAnnotationsPdf',
    'deskew-pdf': 'DeskewPdf',
    'ocr-pdf': 'OcrPdf',
    'automate-pdf': 'AutomatePdf',
    'pdf-metadata-editor': 'PdfMetadataEditor',
    'pdf-redactor': 'PdfRedactor',
    'compare-pdfs': 'ComparePdfs',
    'pdf-editor': 'PdfEditor',
    'color-picker': 'ColorPicker'
};

let lazyImports = "";
for (const id of missing) {
    const compName = idToComponentMap[id];
    if (compName) {
        let filePath = "";
        for (const fp of filePaths) {
            if (fp.exports.includes(compName)) {
                filePath = fp.file;
                break;
            }
        }
        if (filePath) {
            lazyImports += `const ${compName} = lazy(() => import("${filePath}").then(m => ({ default: m.${compName} })));\n`;
        }
    }
}

let routes = "";
for (const id of missing) {
    const compName = idToComponentMap[id];
    if (compName) {
        routes += `          <Route path="tool/${id}" element={<ToolLayout toolId="${id}"><${compName} /></ToolLayout>} />\n`;
    }
}

// Inject imports
const importMarker = "const MergePdf = lazy(() => import(\"./tools/pdf/MergePdf\").then(m => ({ default: m.MergePdf })));\n";
appTsx = appTsx.replace(importMarker, importMarker + lazyImports);

// Inject routes
const routeMarker = "{/* PDF Routes */}\n          <Route path=\"tool/merge-pdf\" element={<ToolLayout toolId=\"merge-pdf\"><MergePdf /></ToolLayout>} />\n";
appTsx = appTsx.replace(routeMarker, routeMarker + routes);

fs.writeFileSync('src/App.tsx', appTsx);
console.log("Updated App.tsx successfully.");

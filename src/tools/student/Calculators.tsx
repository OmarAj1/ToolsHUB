import { GenericToolWrapper } from "../../components/ui/GenericToolWrapper";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

function GpaCalculatorBase() {
  const [courses, setCourses] = useState([{ name: "", credits: 3, grade: "A" }]);
  const gradeValues: Record<string, number> = { "A+": 4.0, "A": 4.0, "A-": 3.7, "B+": 3.3, "B": 3.0, "B-": 2.7, "C+": 2.3, "C": 2.0, "C-": 1.7, "D+": 1.3, "D": 1.0, "F": 0.0 };

  const addCourse = () => setCourses([...courses, { name: "", credits: 3, grade: "A" }]);
  const removeCourse = (index: number) => setCourses(courses.filter((_, i) => i !== index));
  const updateCourse = (index: number, field: string, value: any) => {
    const newCourses = [...courses];
    newCourses[index] = { ...newCourses[index], [field]: value };
    setCourses(newCourses);
  };

  const totalCredits = courses.reduce((acc, curr) => acc + curr.credits, 0);
  const totalPoints = courses.reduce((acc, curr) => acc + (curr.credits * (gradeValues[curr.grade] || 0)), 0);
  const gpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : "0.00";

  return (
    <div className="p-6 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-3xl space-y-6">
        <div className="bg-blue-50 bg-blue-900/20 text-blue-800 text-blue-300 p-6 rounded-2xl flex flex-col items-center justify-center shadow-sm border border-blue-100 border-blue-800/50">
           <h2 className="text-sm uppercase font-bold tracking-wider mb-1 opacity-80">Estimated GPA</h2>
           <div className="text-6xl font-extrabold tracking-tighter">{gpa}</div>
        </div>

        <div className="space-y-4">
          <div className="hidden md:flex gap-4 px-4 text-xs font-bold text-slate-400 text-slate-50 uppercase tracking-wider">
             <div className="flex-1">Course Name</div>
             <div className="w-24 text-center">Credits</div>
             <div className="w-24 text-center">Grade</div>
             <div className="w-10"></div>
          </div>
          {courses.map((course, i) => (
            <div key={i} className="flex flex-col md:flex-row items-center gap-4 bg-slate-800 bg-slate-800 p-4 md:px-4 md:py-2 border border-slate-700 border-slate-700 rounded-xl shadow-sm transition-colors focus-within:border-blue-400 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 focus-within:ring-blue-900/30 placeholder-slate-300 placeholder-slate-600">
              <input type="text" placeholder={`Course ${i + 1}`} value={course.name} onChange={e => updateCourse(i, 'name', e.target.value)} className="flex-1 w-full bg-transparent px-2 py-2 outline-none font-medium text-slate-50 text-slate-50" />
              <div className="flex gap-4 w-full md:w-auto items-center">
                <input type="number" min="0" placeholder="Credits" value={course.credits} onChange={e => updateCourse(i, 'credits', parseFloat(e.target.value) || 0)} className="w-full md:w-24 bg-slate-900 bg-slate-900 border border-slate-700 border-slate-700 px-3 py-2 rounded-lg outline-none text-center focus:border-blue-500 focus:border-blue-500 focus:bg-slate-800 focus:bg-slate-900 text-slate-50 text-slate-50 transition-colors" />
                <select value={course.grade} onChange={e => updateCourse(i, 'grade', e.target.value)} className="w-full md:w-24 bg-slate-900 bg-slate-900 border border-slate-700 border-slate-700 px-3 py-2 rounded-lg outline-none text-center focus:border-blue-500 focus:border-blue-500 focus:bg-slate-800 focus:bg-slate-900 transition-colors appearance-none font-bold text-slate-50 text-slate-50">
                  {Object.keys(gradeValues).map(g => <option key={g} value={g}>{g}</option>)}
                </select>
                <button onClick={() => removeCourse(i)} className="p-2 text-slate-300 text-slate-50 hover:text-red-500 hover:text-red-400 hover:bg-red-50 hover:bg-red-900/20 rounded-lg transition-colors"><Trash2 className="w-5 h-5 text-purple-500" /></button>
              </div>
            </div>
          ))}
        </div>

        <button onClick={addCourse} className="flex items-center justify-center w-full py-4 border-2 border-dashed border-slate-700 border-slate-700 text-slate-400 text-slate-50 font-bold rounded-xl hover:bg-slate-800 hover:bg-slate-700 hover:text-blue-600 hover:text-blue-400 hover:border-blue-300 hover:border-blue-600 transition-all">
          <Plus className="w-5 h-5 mr-2 text-purple-500" /> Add Course
        </button>
      </div>
    </div>
  );
}

function GradeCalculatorBase() {
  const [currentGrade, setCurrentGrade] = useState(85);
  const [targetGrade, setTargetGrade] = useState(90);
  const [finalWeight, setFinalWeight] = useState(20);

  const neededOnFinal = ((targetGrade - (currentGrade * (1 - (finalWeight / 100)))) / (finalWeight / 100)).toFixed(2);

  return (
    <div className="p-6 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-xl space-y-6">
        <div className="bg-slate-800 bg-slate-800 p-8 border border-slate-700 border-slate-700 rounded-3xl space-y-6 shadow-sm">
          <div>
            <label className="block text-sm font-bold text-slate-50 text-slate-50 mb-2">Current Grade (%)</label>
             <input type="number" value={currentGrade} onChange={e => setCurrentGrade(parseFloat(e.target.value) || 0)} className="w-full px-4 py-3 bg-slate-900 bg-slate-900 border border-slate-700 border-slate-700 text-slate-50 text-slate-50 rounded-xl focus:bg-slate-800 focus:bg-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:ring-blue-900/30 outline-none transition-all font-mono text-lg" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-50 text-slate-50 mb-2">Target Class Grade (%)</label>
             <input type="number" value={targetGrade} onChange={e => setTargetGrade(parseFloat(e.target.value) || 0)} className="w-full px-4 py-3 bg-slate-900 bg-slate-900 border border-slate-700 border-slate-700 text-slate-50 text-slate-50 rounded-xl focus:bg-slate-800 focus:bg-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:ring-blue-900/30 outline-none transition-all font-mono text-lg" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-50 text-slate-50 mb-2">Weight of Final Exam (%)</label>
             <input type="number" value={finalWeight} onChange={e => setFinalWeight(parseFloat(e.target.value) || 0)} className="w-full px-4 py-3 bg-slate-900 bg-slate-900 border border-slate-700 border-slate-700 text-slate-50 text-slate-50 rounded-xl focus:bg-slate-800 focus:bg-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:ring-blue-900/30 outline-none transition-all font-mono text-lg" />
          </div>
        </div>
        
        <div className="bg-blue-500 text-white p-8 rounded-3xl text-center shadow-lg shadow-blue-500/20">
           <h3 className="text-blue-100 font-medium mb-2">You need to score at least</h3>
           <div className={`text-6xl font-extrabold tracking-tighter ${parseFloat(neededOnFinal) > 100 ? 'text-red-300' : 'text-white'}`}>{neededOnFinal}%</div>
           <p className="text-xs text-blue-200 mt-4 font-bold uppercase tracking-widest">on your final exam</p>
        </div>
      </div>
    </div>
  );
}

function ReadingTimeCalculatorBase() {
  const [text, setText] = useState("");
  const [wpm, setWpm] = useState(250);

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const timeMin = wordCount / wpm;

  return (
    <div className="p-6 md:p-8 flex flex-col items-center">
       <div className="w-full max-w-4xl space-y-6">
         <div className="flex items-center gap-4 bg-slate-800 bg-slate-800 px-6 py-4 border border-slate-700 border-slate-700 rounded-2xl shadow-sm w-fit">
            <label className="text-sm font-bold text-slate-50 text-slate-50 whitespace-nowrap">Reading Speed (WPM):</label>
            <input type="number" value={wpm} onChange={e => setWpm(parseInt(e.target.value)||1)} className="w-24 px-3 py-2 bg-slate-900 bg-slate-900 border border-slate-700 border-slate-700 text-slate-50 text-slate-50 rounded-lg focus:border-blue-500 focus:bg-slate-800 focus:bg-slate-900 outline-none text-center font-mono font-medium transition-colors" />
         </div>

         <textarea 
            value={text} 
            onChange={e => setText(e.target.value)} 
            placeholder="Paste your text here to estimate reading time..."
            className="w-full h-80 p-6 font-serif text-lg leading-relaxed border border-slate-700 border-slate-700 rounded-3xl focus:border-blue-500 focus:ring-4 focus:ring-blue-50 focus:ring-blue-900/30 outline-none resize-y shadow-inner bg-slate-800 bg-slate-900 text-slate-50 text-slate-50 placeholder-slate-300 placeholder-slate-600"
            spellCheck={false}
         />

         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-800 bg-slate-800 border border-slate-700 border-slate-700 p-6 rounded-2xl text-center shadow-sm">
              <div className="text-xs font-bold text-slate-400 text-slate-50 uppercase tracking-wider mb-2">Words</div>
              <div className="text-3xl font-extrabold font-mono text-slate-50 text-slate-50">{wordCount}</div>
            </div>
            <div className="bg-slate-800 bg-slate-800 border border-slate-700 border-slate-700 p-6 rounded-2xl text-center shadow-sm">
              <div className="text-xs font-bold text-slate-400 text-slate-50 uppercase tracking-wider mb-2">Minutes</div>
              <div className="text-3xl font-extrabold font-mono text-slate-50 text-slate-50">{Math.floor(timeMin)}</div>
            </div>
            <div className="bg-slate-800 bg-slate-800 border border-slate-700 border-slate-700 p-6 rounded-2xl text-center shadow-sm">
              <div className="text-xs font-bold text-slate-400 text-slate-50 uppercase tracking-wider mb-2">Seconds</div>
              <div className="text-3xl font-extrabold font-mono text-slate-50 text-slate-50">{Math.round((timeMin % 1) * 60)}</div>
            </div>
            <div className="bg-blue-500 border border-blue-600 text-white p-6 rounded-2xl text-center shadow-md shadow-blue-500/20">
              <div className="text-xs font-bold text-blue-200 uppercase tracking-wider mb-2">Total Time</div>
              <div className="text-3xl font-extrabold tracking-tighter">{Math.ceil(timeMin)}m</div>
            </div>
         </div>
       </div>
    </div>
  );
}

export const GpaCalculator = () => <GenericToolWrapper toolName="GpaCalculator"><GpaCalculatorBase /></GenericToolWrapper>;

export const GradeCalculator = () => <GenericToolWrapper toolName="GradeCalculator"><GradeCalculatorBase /></GenericToolWrapper>;

export const ReadingTimeCalculator = () => <GenericToolWrapper toolName="ReadingTimeCalculator"><ReadingTimeCalculatorBase /></GenericToolWrapper>;

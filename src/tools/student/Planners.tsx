import { useState } from "react";
import { Plus, Trash2, Calendar, CheckSquare, Clock } from "lucide-react";

export function StudyScheduleGenerator() {
  const [subjects, setSubjects] = useState([{ name: "", hours: 2 }]);
  
  const addSubject = () => setSubjects([...subjects, { name: "", hours: 2 }]);
  const removeSubject = (i: number) => setSubjects(subjects.filter((_, idx) => idx !== i));

  return (
    <div className="p-6 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-3xl space-y-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-start gap-4">
           <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center shrink-0">
             <Calendar className="w-6 h-6" />
           </div>
           <div>
             <h3 className="font-bold text-slate-800 dark:text-slate-200 text-lg mb-1">Weekly Study Plan Matrix</h3>
             <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm">Distribute your total weekly study hours across all your subjects. Use this utility to balance your academic workload evenly.</p>
           </div>
        </div>

        <div className="space-y-3">
          {subjects.map((sub, i) => (
            <div key={i} className="flex flex-col sm:flex-row items-center gap-4 bg-white dark:bg-slate-900 px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm focus-within:border-blue-400 dark:focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-50 dark:focus-within:ring-blue-900/20 transition-all">
              <input type="text" placeholder="Subject (e.g. Biology, Math)" value={sub.name} onChange={(e) => {
                const newSub = [...subjects];
                newSub[i].name = e.target.value;
                setSubjects(newSub);
              }} className="flex-1 w-full bg-transparent px-2 py-2 outline-none font-bold text-slate-800 dark:text-slate-200 placeholder-slate-300 dark:placeholder-slate-600" />
              <div className="flex items-center gap-4 w-full sm:w-auto px-2 sm:px-0">
                <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider whitespace-nowrap">Hrs/Week</label>
                <input type="number" min="0" value={sub.hours} onChange={(e) => {
                  const newSub = [...subjects];
                  newSub[i].hours = parseInt(e.target.value) || 0;
                  setSubjects(newSub);
                }} className="w-20 px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 dark:focus:border-blue-500 text-center font-mono font-medium dark:text-slate-300 transition-colors" />
                <button onClick={() => removeSubject(i)} className="text-slate-300 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-lg transition-colors"><Trash2 className="w-5 h-5" /></button>
              </div>
            </div>
          ))}
        </div>

        <button onClick={addSubject} className="w-full py-4 border-2 border-dashed border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-bold rounded-2xl hover:bg-white dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-300 dark:hover:border-blue-600 transition-all shadow-sm">
          <Plus className="w-5 h-5 inline mr-2" /> Add Subject
        </button>

        <div className="bg-slate-900 dark:bg-black text-white p-6 sm:p-8 rounded-3xl flex justify-between items-center mt-8 shadow-xl border border-transparent dark:border-slate-800">
           <span className="font-bold text-slate-300 dark:text-slate-400">Total Study Hours / Week</span>
           <span className="text-4xl font-extrabold tracking-tighter text-white">{subjects.reduce((a, b) => a + b.hours, 0)} <span className="text-lg text-slate-500 dark:text-slate-500 tracking-normal font-medium">hrs</span></span>
        </div>
      </div>
    </div>
  );
}

export function ExamCountdownTracker() {
  const [exams, setExams] = useState([{ name: "Midterm", date: new Date(Date.now() + 86400000 * 7).toISOString().slice(0, 10) }]);

  const addExam = () => setExams([...exams, { name: "", date: new Date().toISOString().slice(0,10) }]);
  const removeExam = (i: number) => setExams(exams.filter((_, idx)=>idx!==i));

  return (
    <div className="p-6 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-4xl space-y-6">
        <div className="flex justify-end mb-4">
          <button onClick={addExam} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl w-full md:w-auto shadow-md shadow-blue-500/20 transition-colors">
             <Plus className="w-5 h-5 inline mr-2" /> Add Exam
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {exams.map((exam, i) => {
            const today = new Date();
            today.setHours(0,0,0,0);
            const target = new Date(exam.date);
            const diff = Math.ceil((target.getTime() - today.getTime()) / (1000 * 3600 * 24));

            return (
              <div key={i} className="flex flex-col bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm gap-6 group hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md transition-all relative">
                <button onClick={() => removeExam(i)} className="absolute top-6 right-6 text-slate-300 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"><Trash2 className="w-5 h-5"/></button>
                
                <div className="pr-10">
                  <input type="text" value={exam.name} onChange={e => {
                    const newE = [...exams]; newE[i].name = e.target.value; setExams(newE);
                  }} placeholder="Exam name..." className="w-full text-xl font-extrabold text-slate-800 dark:text-slate-100 bg-transparent outline-none placeholder-slate-300 dark:placeholder-slate-600 border-b border-transparent focus:border-slate-200 dark:focus:border-slate-700 pb-1 transition-colors" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Target Date</div>
                    <input type="date" value={exam.date} onChange={e => {
                      const newE = [...exams]; newE[i].date = e.target.value; setExams(newE);
                    }} className="px-3 py-1.5 -ml-3 bg-slate-50 dark:bg-slate-950 border border-transparent dark:border-slate-800 rounded-lg outline-none focus:border-slate-200 dark:focus:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-300 transition-colors cursor-pointer" />
                  </div>
                  
                  <div className={`py-2 px-4 rounded-xl text-center flex flex-col justify-center min-w-[100px] border ${diff < 0 ? 'bg-slate-50 dark:bg-slate-800/50 text-slate-400 border-slate-100 dark:border-slate-800' : diff <= 3 ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-100 dark:border-red-900/30' : diff <= 7 ? 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border-yellow-100 dark:border-yellow-900/30' : 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-100 dark:border-green-900/30'}`}>
                    <span className="text-3xl font-extrabold tracking-tighter leading-none">{Math.abs(diff)}</span>
                    <span className="text-[9px] font-bold uppercase tracking-widest mt-1 opacity-80">{diff < 0 ? 'Days Ago' : diff === 1 ? 'Day Left' : 'Days Left'}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function AssignmentPlanner() {
  const [assignments, setAssignments] = useState([
    { id: 1, title: "History Essay", course: "Hist 101", status: "todo", due: new Date(Date.now() + 86400000 * 3).toISOString().slice(0, 10) }
  ]);

  const addAssignment = () => {
    setAssignments([...assignments, {
      id: Date.now(),
      title: "",
      course: "",
      status: "todo",
      due: new Date().toISOString().slice(0, 10)
    }]);
  };

  const updateAssignment = (id: number, field: string, value: any) => {
    setAssignments(assignments.map(a => a.id === id ? { ...a, [field]: value } : a));
  };

  const removeAssignment = (id: number) => {
    setAssignments(assignments.filter(a => a.id !== id));
  };

  return (
    <div className="p-6 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-4xl space-y-6">
        <div className="flex justify-between items-center mb-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <CheckSquare className="w-6 h-6 text-indigo-500" /> Assignment Planner
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Track your coursework and upcoming deadlines</p>
          </div>
          <button onClick={addAssignment} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md shadow-indigo-500/20 transition-colors flex items-center">
             <Plus className="w-5 h-5 mr-2" /> Add Task
          </button>
        </div>

        <div className="space-y-4">
          {assignments.map((assignment) => (
            <div key={assignment.id} className="flex flex-col md:flex-row items-center gap-4 bg-white dark:bg-slate-900 p-4 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm focus-within:border-indigo-400 dark:focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-50 dark:focus-within:ring-indigo-900/20 transition-all">
              <div className="flex flex-1 flex-col gap-2 w-full">
                <input 
                  type="text" 
                  placeholder="Assignment Title (e.g. Chapter 4 Summary)" 
                  value={assignment.title} 
                  onChange={(e) => updateAssignment(assignment.id, 'title', e.target.value)} 
                  className={`w-full bg-transparent px-2 outline-none font-bold text-lg text-slate-800 dark:text-slate-200 placeholder-slate-300 dark:placeholder-slate-600 ${assignment.status === 'done' ? 'line-through text-slate-400 dark:text-slate-500' : ''}`} 
                />
                <input 
                  type="text" 
                  placeholder="Course (e.g. CS 101)" 
                  value={assignment.course} 
                  onChange={(e) => updateAssignment(assignment.id, 'course', e.target.value)} 
                  className="w-full bg-transparent px-2 outline-none font-medium text-sm text-indigo-600 dark:text-indigo-400 placeholder-slate-300 dark:placeholder-slate-700" 
                />
              </div>
              <div className="flex items-center gap-4 w-full md:w-auto mt-2 md:mt-0 p-2 md:p-0 border-t border-slate-100 dark:border-slate-800 md:border-t-0">
                <div className="flex-1 flex items-center justify-between gap-4">
                  <div className="flex flex-col">
                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-2">Due Date</label>
                    <input 
                      type="date" 
                      value={assignment.due} 
                      onChange={(e) => updateAssignment(assignment.id, 'due', e.target.value)} 
                      className="px-2 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg outline-none focus:border-indigo-500 dark:focus:border-indigo-500 text-sm font-medium text-slate-600 dark:text-slate-300 transition-colors cursor-pointer" 
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-2">Status</label>
                    <select 
                      value={assignment.status} 
                      onChange={(e) => updateAssignment(assignment.id, 'status', e.target.value)} 
                      className="px-2 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg outline-none focus:border-indigo-500 dark:focus:border-indigo-500 text-sm font-medium text-slate-600 dark:text-slate-300 transition-colors cursor-pointer appearance-none min-w-[100px]"
                    >
                      <option value="todo">To Do</option>
                      <option value="in_progress">In Progress</option>
                      <option value="done">Done ✅</option>
                    </select>
                  </div>
                </div>
                <button onClick={() => removeAssignment(assignment.id)} className="text-slate-300 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-lg transition-colors mt-4 md:mt-0">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
          {assignments.length === 0 && (
            <div className="text-center py-12 text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 border-dashed">
              No assignments added yet. Add a task to get started.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function SemesterPlanner() {
  const [semesters, setSemesters] = useState([
    { id: 1, name: "Fall 2024", courses: [{ id: 1, name: "Intro to CS", credits: 3 }, { id: 2, name: "Calculus I", credits: 4 }] }
  ]);

  const addSemester = () => {
    setSemesters([...semesters, { id: Date.now(), name: `Semester ${semesters.length + 1}`, courses: [] }]);
  };

  const removeSemester = (id: number) => {
    setSemesters(semesters.filter(s => s.id !== id));
  };

  const updateSemesterName = (id: number, name: string) => {
    setSemesters(semesters.map(s => s.id === id ? { ...s, name } : s));
  };

  const addCourse = (semesterId: number) => {
    setSemesters(semesters.map(s => {
      if (s.id === semesterId) {
        return { ...s, courses: [...s.courses, { id: Date.now(), name: "", credits: 3 }] };
      }
      return s;
    }));
  };

  const updateCourse = (semesterId: number, courseId: number, field: string, value: any) => {
    setSemesters(semesters.map(s => {
      if (s.id === semesterId) {
        return {
          ...s,
          courses: s.courses.map(c => c.id === courseId ? { ...c, [field]: value } : c)
        };
      }
      return s;
    }));
  };

  const removeCourse = (semesterId: number, courseId: number) => {
    setSemesters(semesters.map(s => {
      if (s.id === semesterId) {
        return { ...s, courses: s.courses.filter(c => c.id !== courseId) };
      }
      return s;
    }));
  };

  return (
    <div className="p-6 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-5xl space-y-6">
        <div className="flex justify-between items-center bg-indigo-50 dark:bg-indigo-900/20 text-indigo-800 dark:text-indigo-300 p-6 rounded-2xl shadow-sm border border-indigo-100 dark:border-indigo-800/50">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Clock className="w-6 h-6" /> Semester & Degree Planner
            </h2>
            <p className="opacity-80 text-sm mt-1">Map out your degree roadmap over multiple semesters.</p>
          </div>
          <button onClick={addSemester} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md shadow-indigo-500/20 transition-colors flex items-center">
             <Plus className="w-5 h-5 mr-2" /> Add Semester
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {semesters.map(semester => {
            const totalCredits = semester.courses.reduce((sum, c) => sum + (Number(c.credits) || 0), 0);
            
            return (
              <div key={semester.id} className="bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm flex flex-col group relative transition-colors focus-within:border-indigo-400 dark:focus-within:border-indigo-600">
                <button onClick={() => removeSemester(semester.id)} className="absolute top-6 right-6 text-slate-300 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
                  <Trash2 className="w-5 h-5" />
                </button>
                
                <div className="pr-10 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                  <input 
                    type="text" 
                    value={semester.name} 
                    onChange={e => updateSemesterName(semester.id, e.target.value)} 
                    placeholder="e.g. Fall 2024" 
                    className="w-full text-2xl font-extrabold text-slate-800 dark:text-slate-100 bg-transparent outline-none placeholder-slate-300 dark:placeholder-slate-600 transition-colors" 
                  />
                  <div className="text-sm font-bold text-slate-400 dark:text-slate-500 mt-1 uppercase tracking-wider">
                    {totalCredits} Total Credits
                  </div>
                </div>
                
                <div className="flex-1 space-y-3 mb-6">
                  {semester.courses.map(course => (
                    <div key={course.id} className="flex items-center gap-3 bg-slate-50 dark:bg-slate-950 p-2 pr-3 rounded-xl border border-slate-200 dark:border-slate-800 focus-within:border-indigo-300 dark:focus-within:border-indigo-700 transition-colors">
                      <input 
                        type="text" 
                        value={course.name} 
                        onChange={e => updateCourse(semester.id, course.id, 'name', e.target.value)} 
                        placeholder="Course Name" 
                        className="flex-1 bg-transparent px-2 py-1 outline-none font-medium text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600" 
                      />
                      <input 
                        type="number" 
                        min="0" 
                        value={course.credits} 
                        onChange={e => updateCourse(semester.id, course.id, 'credits', e.target.value)} 
                        className="w-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-2 py-1 rounded-lg outline-none text-center font-mono text-sm dark:text-slate-300 focus:border-indigo-500 dark:focus:border-indigo-500" 
                      />
                      <button onClick={() => removeCourse(semester.id, course.id)} className="text-slate-300 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {semester.courses.length === 0 && (
                    <div className="text-center py-6 text-sm text-slate-400 dark:text-slate-600 italic">No courses added.</div>
                  )}
                </div>
                
                <button onClick={() => addCourse(semester.id)} className="w-full py-3 border-2 border-dashed border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all flex justify-center items-center">
                  <Plus className="w-4 h-4 mr-2" /> Add Course
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}


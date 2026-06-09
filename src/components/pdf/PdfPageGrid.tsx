import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { PdfPageInfo } from '../../hooks/usePdfPages';
import { Trash2, ZoomIn, ZoomOut, CheckCircle2, Circle } from 'lucide-react';

interface SortablePageProps {
  page: PdfPageInfo;
  index: number;
  onRemove: (id: string) => void;
  onToggleExclude: (id: string) => void;
}

function SortablePage({ page, index, onRemove, onToggleExclude }: SortablePageProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: page.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.8 : page.isExcluded ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group bg-white dark:bg-stone-800 rounded-lg p-2 border-2 ${
        isDragging ? 'border-blue-500 shadow-xl scale-105' : 'border-stone-200 dark:border-stone-700 shadow-sm'
      } transition-transform cursor-grab active:cursor-grabbing flex flex-col items-center ${page.isExcluded ? 'grayscale' : ''}`}
      {...attributes}
      {...listeners}
    >
      <div className="absolute top-1 left-2 bg-black/60 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm z-10">
        {index + 1}
      </div>
      <button
        type="button"
        onPointerDown={(e) => {
          e.stopPropagation();
          onToggleExclude(page.id);
        }}
        className="absolute top-2 right-8 bg-white dark:bg-stone-800 rounded-full shadow hover:scale-110 transition-transform z-10 p-0.5"
      >
        {page.isExcluded ? (
          <Circle className="w-5 h-5 text-stone-400" />
        ) : (
          <CheckCircle2 className="w-5 h-5 text-blue-500" />
        )}
      </button>
      <button
        type="button"
        onPointerDown={(e) => {
          e.stopPropagation();
          onRemove(page.id);
        }}
        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 z-10"
      >
        <Trash2 className="w-3 h-3" />
      </button>
      
      <div className="w-full aspect-[1/1.4] relative overflow-hidden rounded border border-stone-100 dark:border-stone-600 bg-stone-50 dark:bg-stone-900 pointer-events-none">
        <img
          src={page.thumbnailUrl}
          alt={`Page ${page.pageIndex + 1}`}
          className="w-full relative h-full object-contain pointer-events-none"
        />
      </div>
      <p className="text-[9px] mt-2 text-stone-500 truncate w-full text-center pointer-events-none">
        Pg {page.pageIndex + 1}
      </p>
    </div>
  );
}

interface PdfPageGridProps {
  pages: PdfPageInfo[];
  setPages: React.Dispatch<React.SetStateAction<PdfPageInfo[]>>;
  isLoading: boolean;
}

export function PdfPageGrid({ pages, setPages, isLoading }: PdfPageGridProps) {
  const [zoomLevel, setZoomLevel] = useState(3);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setPages((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const removePage = (id: string) => {
    setPages((prev) => prev.filter(p => p.id !== id));
  };
  
  const toggleExclude = (id: string) => {
    setPages((prev) => prev.map(p => p.id === id ? { ...p, isExcluded: !p.isExcluded } : p));
  };

  if (isLoading) {
    return (
      <div className="w-full py-12 flex flex-col items-center justify-center border-2 border-dashed border-stone-200 dark:border-stone-700 rounded-2xl bg-stone-50 dark:bg-stone-900/50 mb-6">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-stone-600 dark:text-stone-400 font-medium">Extracting document pages...</p>
      </div>
    );
  }

  if (pages.length === 0) return null;

  const gridColumnsClass = {
    1: 'grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10',
    2: 'grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8',
    3: 'grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-5',
    4: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4',
    5: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3',
  }[zoomLevel];

  return (
    <div className="w-full bg-stone-50 dark:bg-stone-900/50 rounded-2xl p-6 border border-stone-200 dark:border-stone-800 mb-6">
      <div className="mb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-stone-900 dark:text-white flex items-center">
            Arrange Pages ({pages.length})
          </h3>
          <p className="text-sm text-stone-500 dark:text-stone-400">
            Drag to reorder. Uncheck or delete pages you want to exclude.
          </p>
        </div>
        <div className="flex items-center space-x-3 bg-white dark:bg-stone-800 px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 shadow-sm shrink-0">
          <ZoomOut className="w-4 h-4 text-stone-400" />
          <input 
            type="range" 
            min="1" 
            max="5" 
            value={zoomLevel} 
            onChange={(e) => setZoomLevel(Number(e.target.value))} 
            className="w-24 md:w-32 accent-blue-600"
          />
          <ZoomIn className="w-4 h-4 text-stone-400" />
        </div>
      </div>
      
      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext 
          items={pages.map(p => p.id)}
          strategy={rectSortingStrategy}
        >
          <div className={`grid ${gridColumnsClass} gap-4 max-h-[600px] overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-stone-300 dark:scrollbar-thumb-stone-600`}>
            {pages.map((page, idx) => (
              <SortablePage 
                key={page.id} 
                page={page} 
                index={idx} 
                onRemove={removePage}
                onToggleExclude={toggleExclude}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}

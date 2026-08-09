"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import ModuleHeader from "../ModuleHeader";

type AnnualProject = {
  id: string;
  name: string;
  months: number[];
};

type TimelineSegment = {
  start: number;
  end: number;
};

const monthLabels = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];

const annualProjects: AnnualProject[] = [
  { id: "start", name: "开工专题", months: [2] },
  { id: "leadership", name: "学习领导讲话专题", months: [3] },
  { id: "spring", name: "春季冲锋专题", months: [3, 4, 5] },
  { id: "production", name: "生产忙季专题", months: [4, 5, 6, 7] },
  { id: "workers", name: "先进工作者系列", months: [3, 4] },
  { id: "youth", name: "星青年系列", months: [5] },
  { id: "summer", name: "夏季攻势专题", months: [6, 7, 8] },
  { id: "heat", name: "战高温专题", months: [7, 8] },
  { id: "safety", name: "安全专题", months: [6] },
  { id: "party-members", name: "优秀共产党员系列", months: [7] },
  { id: "veterans", name: "退伍军人系列", months: [8] },
  { id: "autumn-winter", name: "秋冬冲刺专题", months: [9, 10, 11] },
  { id: "anniversary", name: "周年庆专题", months: [9] },
  { id: "ding-talk", name: "钉钉圈子活动", months: [3, 5, 9] },
  { id: "review", name: "总结复盘专题", months: [1, 12] },
  { id: "growth", name: "团队成长专题", months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
  { id: "group-publications", name: "集团刊物供稿", months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
];

const toSegments = (months: number[]): TimelineSegment[] => {
  const sortedMonths = [...months].sort((left, right) => left - right);
  const segments: TimelineSegment[] = [];

  for (const month of sortedMonths) {
    const previous = segments.at(-1);
    if (previous && month === previous.end + 1) previous.end = month;
    else segments.push({ start: month, end: month });
  }

  return segments;
};

export default function AnnualEditorialPlan() {
  const currentMonth = new Date().getMonth() + 1;
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const currentMonthRef = useRef<HTMLSpanElement>(null);
  const projects = useMemo(
    () => annualProjects.map((project) => ({ ...project, segments: toSegments(project.months) })),
    [],
  );

  useEffect(() => {
    const scrollArea = scrollRef.current;
    const month = currentMonthRef.current;
    if (!scrollArea || !month || scrollArea.scrollWidth <= scrollArea.clientWidth) return;

    const monthRow = month.parentElement;
    const targetCenter = (monthRow?.offsetLeft ?? 0) + month.offsetLeft + month.offsetWidth / 2;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    scrollArea.scrollTo({
      left: Math.max(0, targetCenter - scrollArea.clientWidth / 2),
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }, [currentMonth]);

  return (
    <main className="annual-page">
      <ModuleHeader activeSection="annual" />

      <section className="annual-hero" aria-labelledby="annual-title">
        <h1 id="annual-title" className="annual-title">
          <span>年度宣传</span>
          <span>ANNUAL EDITORIAL PLAN</span>
        </h1>
      </section>

      <section className="annual-timeline" aria-label="年度重点宣传项目时间轴">
        <div className="timeline-scroll" ref={scrollRef}>
          <div className="timeline-board">
            <div className="timeline-header" aria-hidden="true">
              <span className="timeline-project-heading">PROJECT</span>
              <div className="timeline-months">
                {monthLabels.map((label, index) => {
                  const month = index + 1;
                  const isCurrent = month === currentMonth;
                  return (
                    <span
                      className={isCurrent ? "timeline-month is-current" : "timeline-month"}
                      key={label}
                      ref={isCurrent ? currentMonthRef : undefined}
                    >
                      {label}
                    </span>
                  );
                })}
              </div>
            </div>

            <div className="timeline-rows">
              <div className="now-line-layer" aria-hidden="true">
                <span
                  className="now-line"
                  style={{ left: `${((currentMonth - 0.5) / 12) * 100}%` }}
                >
                  <span>NOW</span>
                </span>
              </div>

              {projects.map((project, index) => {
                const isHovered = hoveredProject === project.id;
                const isMuted = hoveredProject !== null && !isHovered;
                const monthNames = project.months.map((month) => monthLabels[month - 1]).join("、");

                return (
                  <div
                    className={`timeline-row${isHovered ? " is-hovered" : ""}${isMuted ? " is-muted" : ""}`}
                    key={project.id}
                    tabIndex={0}
                    aria-label={`${project.name}：${monthNames}`}
                    onMouseEnter={() => setHoveredProject(project.id)}
                    onMouseLeave={() => setHoveredProject(null)}
                    onFocus={() => setHoveredProject(project.id)}
                    onBlur={() => setHoveredProject(null)}
                  >
                    <div className="timeline-project">
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      <strong>{project.name}</strong>
                    </div>

                    <div className="timeline-track">
                      <div className="timeline-cells" aria-hidden="true">
                        {monthLabels.map((label, monthIndex) => (
                          <span
                            className={monthIndex + 1 === currentMonth ? "is-current" : ""}
                            key={label}
                          />
                        ))}
                      </div>

                      <div className="timeline-periods" aria-hidden="true">
                        {project.segments.map((segment) => {
                          const singleMonth = segment.start === segment.end;
                          return (
                            <span
                              className={singleMonth ? "period-node" : "period-bar"}
                              key={`${segment.start}-${segment.end}`}
                              style={{ gridColumn: `${segment.start} / ${segment.end + 1}` }}
                            />
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

"use client";

import Image from "next/image";
import { useState } from "react";

export type CompositionItem = {
  src: string;
  label: string;
};

export type MeetingItem = {
  code: string;
  title: string;
  image: string;
  points: string[];
};

export function CompositionAccordion({
  items,
  defaultIndex = 1,
}: {
  items: CompositionItem[];
  defaultIndex?: number;
}) {
  const [activeIndex, setActiveIndex] = useState(defaultIndex);

  return (
    <div className="composition-accordion" role="group" aria-label="六种构图方法示例">
      {items.map((item, index) => {
        const isActive = index === activeIndex;

        return (
          <button
            type="button"
            className={`composition-accordion__item${isActive ? " is-active" : ""}`}
            onMouseEnter={() => setActiveIndex(index)}
            onFocus={() => setActiveIndex(index)}
            onClick={() => setActiveIndex(index)}
            aria-pressed={isActive}
            aria-label={`查看${item.label}示例`}
            key={`${item.src}-${item.label}`}
          >
            <Image
              src={item.src}
              alt={`${item.label}示例`}
              fill
              sizes="(max-width: 680px) 88vw, 62vw"
            />
            <span className="composition-accordion__shade" aria-hidden="true" />
            <span className="composition-accordion__index">{String(index + 1).padStart(2, "0")}</span>
            <span className="composition-accordion__label">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export function MeetingEditorial({
  items,
  sectionLabel = "MEETING / TRAINING",
  navigationLabel = "会议培训拍摄类型",
}: {
  items: MeetingItem[];
  sectionLabel?: string;
  navigationLabel?: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const current = items[activeIndex];

  const show = (index: number) => {
    if (index !== activeIndex) setActiveIndex(index);
  };

  const showPrevious = () => {
    show(activeIndex === 0 ? items.length - 1 : activeIndex - 1);
  };

  const showNext = () => {
    show(activeIndex === items.length - 1 ? 0 : activeIndex + 1);
  };

  return (
    <div className="meeting-editorial">
      <div className="meeting-editorial__stage" key={current.code}>
        <span className="meeting-editorial__number" aria-hidden="true">{current.code}</span>

        <div className="meeting-editorial__image">
          <Image
            src={current.image}
            alt={`${current.title}示例`}
            fill
            sizes="(max-width: 680px) 100vw, 52vw"
          />
        </div>

        <div className="meeting-editorial__copy">
          <p className="meeting-editorial__eyebrow">{sectionLabel}</p>
          <h3>{current.title}</h3>
          <ol>
            {current.points.map((point, index) => (
              <li key={point}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <p>{point}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="meeting-editorial__navigation">
        <div className="meeting-editorial__selectors" role="tablist" aria-label={navigationLabel}>
          {items.map((item, index) => (
            <button
              type="button"
              className={index === activeIndex ? "is-active" : ""}
              onClick={() => show(index)}
              role="tab"
              aria-selected={index === activeIndex}
              aria-label={`查看${item.title}`}
              key={item.code}
            >
              <span />
            </button>
          ))}
          <strong>{String(activeIndex + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}</strong>
        </div>

        <div className="meeting-editorial__arrows">
          <button type="button" onClick={showPrevious} aria-label="上一种拍摄类型">←</button>
          <button type="button" onClick={showNext} aria-label="下一种拍摄类型">→</button>
        </div>
      </div>
    </div>
  );
}

import { usePageBuilderStore } from '../stores/pagebuilder-store-provider';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { FrameContextConsumer } from 'react-frame-component';
import FrameComponent from 'react-frame-component';
import { useCssLive } from '../stores/useCssLive';
import React from 'react';
import FrameContentWrapper from './FrameContentWrapper';
import TestScene from './TestScene';

export const RenderScene = () => {
  const selectedBreakpoint = usePageBuilderStore(
    (state) => state.selectedBreakPoint
  );
  const stylesheets = useCssLive((state) => state.parentStylesheets);

  return (
    <div
      className='flex-1 p-4 bg-slate-300 overflow-x-auto space-x-0'
      style={{
        display: selectedBreakpoint.name === 'mobile' ? 'flex' : 'block',
        justifyContent:
          selectedBreakpoint.name === 'mobile' ? 'center' : 'flex-start'
      }}>
      {/* <TestScene /> */}
      <FrameComponent
        style={{
          border: 'none',
          width: selectedBreakpoint.size.width,
          height: selectedBreakpoint.size.height
        }}
        head={
          <>
            <style
              dangerouslySetInnerHTML={{
                __html: `.frame-root { flex: 1; } .frame-content { height: 100%; }`
              }}
            />
            {stylesheets.map((href, index) => (
              <link key={index} rel='stylesheet' href={href} />
            ))}
          </>
        }>
        <FrameContextConsumer>
          {({ window }) => (
            <DndProvider backend={HTML5Backend} context={window}>
              <FrameContentWrapper />
            </DndProvider>
          )}
        </FrameContextConsumer>
      </FrameComponent>
    </div>
  );
};

function PageBuilderDesignStyle() {
  return (
    <style>{`
          .selected-element, .selected-element-block {
            position: relative;
            }
            .selected-element::before, .selected-element-block::before {
              content: '';
              position: absolute;
              inset: 0;
              border: 2px dashed #3b82f6;
              pointer-events: none;
              border-radius: 4px;
              }
              .selected-element-block::before {
                border: 2px dashed green;
              }
        `}</style>
  );
}
export default PageBuilderDesignStyle;

import React, { useState, useRef } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Plus, Trash2, Settings, Move } from 'lucide-react';
import { Button } from '../ui/Button';

interface CanvasComponent {
  id: string;
  type: string;
  props: Record<string, any>;
  children?: CanvasComponent[];
}

interface CanvasState {
  components: CanvasComponent[];
}

interface CanvasProps {
  initialState?: CanvasState;
  onSave?: (state: CanvasState) => void;
  readOnly?: boolean;
}

export const Canvas: React.FC<CanvasProps> = ({ 
  initialState = { components: [] }, 
  onSave,
  readOnly = false
}) => {
  const [canvasState, setCanvasState] = useState<CanvasState>(initialState);
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(canvasState.components);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setCanvasState({ components: items });
    if (onSave) onSave({ components: items });
  };

  const addComponent = (type: string) => {
    const newComponent: CanvasComponent = {
      id: `component-${Date.now()}`,
      type,
      props: getDefaultPropsForType(type),
    };

    const updatedComponents = [...canvasState.components, newComponent];
    setCanvasState({ components: updatedComponents });
    if (onSave) onSave({ components: updatedComponents });
    setSelectedComponentId(newComponent.id);
  };

  const removeComponent = (id: string) => {
    const updatedComponents = canvasState.components.filter(comp => comp.id !== id);
    setCanvasState({ components: updatedComponents });
    if (onSave) onSave({ components: updatedComponents });
    if (selectedComponentId === id) setSelectedComponentId(null);
  };

  const updateComponentProps = (id: string, props: Record<string, any>) => {
    const updatedComponents = canvasState.components.map(comp => 
      comp.id === id ? { ...comp, props: { ...comp.props, ...props } } : comp
    );
    setCanvasState({ components: updatedComponents });
    if (onSave) onSave({ components: updatedComponents });
  };

  const getDefaultPropsForType = (type: string): Record<string, any> => {
    switch (type) {
      case 'heading':
        return { text: 'Heading', level: 'h1', className: 'text-2xl font-bold' };
      case 'paragraph':
        return { text: 'This is a paragraph of text.', className: 'text-gray-700' };
      case 'button':
        return { text: 'Button', variant: 'primary', size: 'md' };
      case 'image':
        return { src: 'https://via.placeholder.com/400x200', alt: 'Placeholder image', className: 'rounded-md' };
      case 'container':
        return { className: 'p-4 border border-gray-200 rounded-md' };
      default:
        return {};
    }
  };

  const renderComponent = (component: CanvasComponent) => {
    const isSelected = component.id === selectedComponentId;
    
    const componentClasses = `relative ${isSelected ? 'ring-2 ring-blue-500' : ''}`;
    
    switch (component.type) {
      case 'heading':
        const HeadingTag = component.props.level || 'h1';
        return (
          <div className={componentClasses}>
            <HeadingTag className={component.props.className}>
              {component.props.text}
            </HeadingTag>
            {renderComponentControls(component)}
          </div>
        );
      case 'paragraph':
        return (
          <div className={componentClasses}>
            <p className={component.props.className}>
              {component.props.text}
            </p>
            {renderComponentControls(component)}
          </div>
        );
      case 'button':
        return (
          <div className={componentClasses}>
            <Button
              variant={component.props.variant}
              size={component.props.size}
            >
              {component.props.text}
            </Button>
            {renderComponentControls(component)}
          </div>
        );
      case 'image':
        return (
          <div className={componentClasses}>
            <img
              src={component.props.src}
              alt={component.props.alt}
              className={component.props.className}
            />
            {renderComponentControls(component)}
          </div>
        );
      case 'container':
        return (
          <div className={`${componentClasses} ${component.props.className}`}>
            {component.children?.map(child => renderComponent(child))}
            {renderComponentControls(component)}
          </div>
        );
      default:
        return (
          <div className={componentClasses}>
            Unknown component type: {component.type}
            {renderComponentControls(component)}
          </div>
        );
    }
  };

  const renderComponentControls = (component: CanvasComponent) => {
    if (readOnly) return null;
    
    const isSelected = component.id === selectedComponentId;
    
    return (
      <div className={`absolute top-0 right-0 p-1 flex space-x-1 bg-white bg-opacity-75 rounded-bl-md ${isSelected ? 'visible' : 'invisible group-hover:visible'}`}>
        <button
          className="p-1 text-gray-500 hover:text-gray-700 focus:outline-none"
          onClick={() => setSelectedComponentId(component.id)}
          title="Edit component"
        >
          <Settings size={16} />
        </button>
        <button
          className="p-1 text-red-500 hover:text-red-700 focus:outline-none"
          onClick={() => removeComponent(component.id)}
          title="Remove component"
        >
          <Trash2 size={16} />
        </button>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex space-x-2">
          <Button
            size="sm"
            onClick={() => addComponent('heading')}
            leftIcon={<Plus size={16} />}
            disabled={readOnly}
          >
            Heading
          </Button>
          <Button
            size="sm"
            onClick={() => addComponent('paragraph')}
            leftIcon={<Plus size={16} />}
            disabled={readOnly}
          >
            Paragraph
          </Button>
          <Button
            size="sm"
            onClick={() => addComponent('button')}
            leftIcon={<Plus size={16} />}
            disabled={readOnly}
          >
            Button
          </Button>
          <Button
            size="sm"
            onClick={() => addComponent('image')}
            leftIcon={<Plus size={16} />}
            disabled={readOnly}
          >
            Image
          </Button>
          <Button
            size="sm"
            onClick={() => addComponent('container')}
            leftIcon={<Plus size={16} />}
            disabled={readOnly}
          >
            Container
          </Button>
        </div>
      </div>
      
      <div 
        ref={canvasRef}
        className="flex-1 p-8 bg-gray-50 overflow-auto"
      >
        <div className="min-h-[500px] bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="canvas">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-4"
                >
                  {canvasState.components.map((component, index) => (
                    <Draggable
                      key={component.id}
                      draggableId={component.id}
                      index={index}
                      isDragDisabled={readOnly}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="group relative"
                        >
                          <div
                            {...provided.dragHandleProps}
                            className="absolute left-0 top-1/2 -translate-x-full -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
                            title="Drag to reorder"
                          >
                            <Move size={16} />
                          </div>
                          {renderComponent(component)}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          
          {canvasState.components.length === 0 && (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <p>Drag and drop components here to build your UI</p>
              {!readOnly && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => addComponent('heading')}
                  leftIcon={<Plus size={16} />}
                >
                  Add Component
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
      
      {selectedComponentId && !readOnly && (
        <div className="bg-white border-t border-gray-200 p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Component Properties</h3>
          <PropertyEditor
            component={canvasState.components.find(c => c.id === selectedComponentId)!}
            onChange={(props) => updateComponentProps(selectedComponentId, props)}
          />
        </div>
      )}
    </div>
  );
};

interface PropertyEditorProps {
  component: CanvasComponent;
  onChange: (props: Record<string, any>) => void;
}

const PropertyEditor: React.FC<PropertyEditorProps> = ({ component, onChange }) => {
  const handleChange = (key: string, value: any) => {
    onChange({ [key]: value });
  };
  
  switch (component.type) {
    case 'heading':
      return (
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Text"
            value={component.props.text}
            onChange={(e) => handleChange('text', e.target.value)}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Level
            </label>
            <select
              value={component.props.level}
              onChange={(e) => handleChange('level', e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="h1">H1</option>
              <option value="h2">H2</option>
              <option value="h3">H3</option>
              <option value="h4">H4</option>
              <option value="h5">H5</option>
              <option value="h6">H6</option>
            </select>
          </div>
          <Input
            label="CSS Classes"
            value={component.props.className}
            onChange={(e) => handleChange('className', e.target.value)}
          />
        </div>
      );
    case 'paragraph':
      return (
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Text
            </label>
            <textarea
              value={component.props.text}
              onChange={(e) => handleChange('text', e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows={3}
            />
          </div>
          <Input
            label="CSS Classes"
            value={component.props.className}
            onChange={(e) => handleChange('className', e.target.value)}
          />
        </div>
      );
    case 'button':
      return (
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Text"
            value={component.props.text}
            onChange={(e) => handleChange('text', e.target.value)}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Variant
            </label>
            <select
              value={component.props.variant}
              onChange={(e) => handleChange('variant', e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="primary">Primary</option>
              <option value="secondary">Secondary</option>
              <option value="outline">Outline</option>
              <option value="ghost">Ghost</option>
              <option value="danger">Danger</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Size
            </label>
            <select
              value={component.props.size}
              onChange={(e) => handleChange('size', e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="sm">Small</option>
              <option value="md">Medium</option>
              <option value="lg">Large</option>
            </select>
          </div>
        </div>
      );
    case 'image':
      return (
        <div className="grid grid-cols-1 gap-4">
          <Input
            label="Image URL"
            value={component.props.src}
            onChange={(e) => handleChange('src', e.target.value)}
          />
          <Input
            label="Alt Text"
            value={component.props.alt}
            onChange={(e) => handleChange('alt', e.target.value)}
          />
          <Input
            label="CSS Classes"
            value={component.props.className}
            onChange={(e) => handleChange('className', e.target.value)}
          />
        </div>
      );
    case 'container':
      return (
        <div className="grid grid-cols-1 gap-4">
          <Input
            label="CSS Classes"
            value={component.props.className}
            onChange={(e) => handleChange('className', e.target.value)}
          />
        </div>
      );
    default:
      return <p>No properties available for this component type.</p>;
  }
};
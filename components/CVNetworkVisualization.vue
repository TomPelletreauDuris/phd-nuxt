<template>
  <div class="cv-network-container">
    <div class="header">
      <h1>Tom Pelletreau-Duris</h1>
      <p class="tagline">Interactive CV Network</p>
    </div>
    
    <div class="controls">
      <button 
        v-for="filter in filters" 
        :key="filter.id"
        @click="toggleFilter(filter.id)"
        :class="['filter-btn', { active: activeFilters.includes(filter.id) }]"
        :style="{ borderColor: filter.color, color: activeFilters.includes(filter.id) ? 'white' : filter.color, backgroundColor: activeFilters.includes(filter.id) ? filter.color : 'white' }"
      >
        {{ filter.label }}
      </button>
      <button @click="resetView" class="reset-btn">Reset View</button>
    </div>

    <div ref="networkContainer" class="network-svg-container"></div>

    <div v-if="selectedNode" class="info-panel">
      <button @click="selectedNode = null" class="close-btn">×</button>
      <h3>{{ selectedNode.label }}</h3>
      <p class="node-type">{{ selectedNode.type }}</p>
      <div v-if="selectedNode.description" class="description">
        {{ selectedNode.description }}
      </div>
      <div v-if="selectedNode.period" class="period">
        📅 {{ selectedNode.period }}
      </div>
      <div v-if="selectedNode.location" class="location">
        📍 {{ selectedNode.location }}
      </div>
      <div v-if="selectedNode.details && selectedNode.details.length" class="details">
        <ul>
          <li v-for="(detail, idx) in selectedNode.details" :key="idx">{{ detail }}</li>
        </ul>
      </div>
      <a v-if="selectedNode.link" :href="selectedNode.link" target="_blank" class="external-link">
        View More →
      </a>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as d3 from 'd3'

const networkContainer = ref(null)
const selectedNode = ref(null)
const activeFilters = ref(['employment', 'education', 'skills', 'publications', 'projects'])

const filters = [
  { id: 'employment', label: 'Employment', color: '#3B82F6' },
  { id: 'education', label: 'Education', color: '#10B981' },
  { id: 'skills', label: 'Skills', color: '#F59E0B' },
  { id: 'publications', label: 'Publications', color: '#EF4444' },
  { id: 'projects', label: 'Projects', color: '#8B5CF6' }
]

// CV Data Structure
const cvData = {
  nodes: [
    // Central node
    { id: 'tom', label: 'Tom Pelletreau-Duris', type: 'person', size: 40, fixed: true },
    
    // Employment nodes
    { id: 'vua-phd', label: 'VU Amsterdam PhD', type: 'employment', category: 'employment', 
      description: 'PhD candidate: advancing explainability for neurosymbolic AI',
      period: 'June 2025 - now',
      location: 'Amsterdam, NL',
      details: ['Zorro project with Canon & Philips', 'Mechanistic interpretability for GNNs', 'Knowledge Graph embeddings'],
      size: 30 },
    { id: 'vua-ta', label: 'VU Amsterdam TA', type: 'employment', category: 'employment',
      description: 'Teaching Assistant in Machine Learning for Graph course',
      period: 'Jan 2025 - May 2025',
      location: 'Amsterdam, NL',
      size: 20 },
    { id: 'spinoza', label: 'Spinoza Centre', type: 'employment', category: 'employment',
      description: 'Research Internship - Neuroimaging',
      period: 'July 2023 - March 2024',
      location: 'Amsterdam, NL',
      details: ['7T fMRI analysis', 'Python data pipeline', 'Population Receptive Fields mapping'],
      size: 25 },
    { id: 'ens', label: 'ENS Institut Jean Nicod', type: 'employment', category: 'employment',
      description: 'Research Internship',
      period: 'Sept 2021 - Feb 2022',
      location: 'Paris, FR',
      details: ['COVID-19 cognitive disorientation study', 'NLP classifier development', 'Published in PLOS ONE'],
      size: 25 },
    { id: 'sweeeft', label: 'Sweeeft.ai', type: 'employment', category: 'employment',
      description: 'Software Engineer R&D Freelance',
      period: 'Sept 2019 - Aug 2021',
      location: 'Lyon, FR',
      details: ['Full-stack development', 'Psycho-linguistic research automation', 'UI for trace visualization'],
      size: 25 },
    
    // Education nodes
    { id: 'vua-msc', label: 'MSc AI (VU Amsterdam)', type: 'education', category: 'education',
      description: 'Artificial Intelligence: Cognitive Science Track',
      period: 'Sept 2022 - Nov 2024',
      location: 'Amsterdam, NL',
      details: ['GA: 8/10', 'Master thesis: 9/10', 'Published in PMLR'],
      size: 30 },
    { id: 'ensc', label: 'MSc Cognitive Engineering', type: 'education', category: 'education',
      description: 'École Nationale Supérieure de Cognitique',
      period: 'Sept 2019 - July 2022',
      location: 'Bordeaux, FR',
      details: ['GA: 7.5/10', 'Computational cognitive neuroscience thesis'],
      size: 30 },
    { id: 'sorbonne', label: 'CPGE B/L Sorbonne', type: 'education', category: 'education',
      description: 'Philosophy & Social Sciences Bachelors',
      period: 'Sept 2017 - July 2019',
      location: 'Paris, FR',
      details: ['Philosophy of mind', 'Mathematics', 'Sociology', 'Economics'],
      size: 25 },
    
    // Publications
    { id: 'pub-biorxiv', label: 'Psilocybin Study (bioRxiv)', type: 'publication', category: 'publications',
      description: 'Psilocybin alters visual contextual computations',
      period: 'Feb 2025',
      link: 'https://www.biorxiv.org/content/10.1101/2025.02.06.636848v1',
      size: 20 },
    { id: 'pub-pmlr', label: 'GNN States (PMLR)', type: 'publication', category: 'publications',
      description: 'Do graph neural network states contain graph properties?',
      period: 'Nov 2024',
      link: 'https://proceedings.mlr.press',
      size: 20 },
    { id: 'pub-plos', label: 'COVID-19 Study (PLOS ONE)', type: 'publication', category: 'publications',
      description: 'Temporal and social disorientation measurement',
      period: 'Nov 2022',
      link: 'https://doi.org/10.1371/journal.pone.0264604',
      size: 20 },
    
    // Projects
    { id: 'proj-vision', label: 'Vision Language Model', type: 'project', category: 'projects',
      description: 'FLAN-T5 decoder optimization',
      details: ['Reduced trainable parameters', 'Improved performance'],
      size: 18 },
    { id: 'proj-podcast', label: 'Podcast Mobile App', type: 'project', category: 'projects',
      description: 'REACT Native cross-platform app',
      details: ['Spotify, Soundcloud, YouTube APIs', 'Android & iOS'],
      link: 'https://github.com',
      size: 18 },
    { id: 'proj-network', label: 'Political Network Analysis', type: 'project', category: 'projects',
      description: 'French political network mapping',
      details: ['Twitter API data mining', 'Echo chamber analysis', 'Graph theory'],
      size: 18 },
    { id: 'proj-ngo', label: 'Tortuga Preciosa NGO', type: 'project', category: 'projects',
      description: 'Archaeological research in Costa Rica',
      details: ['Sea turtles-human interactions'],
      size: 15 },
    
    // Key Skills Clusters
    { id: 'skill-ai', label: 'AI & ML', type: 'skill', category: 'skills',
      description: 'Deep Learning, GNNs, NLP, XAI',
      size: 25 },
    { id: 'skill-neuro', label: 'Neuroscience', type: 'skill', category: 'skills',
      description: 'fMRI, Cognitive Psychology, Brain Imaging',
      size: 25 },
    { id: 'skill-python', label: 'Python', type: 'skill', category: 'skills',
      description: 'PyTorch, TensorFlow, NumPy, Pandas',
      size: 22 },
    { id: 'skill-web', label: 'Web Dev', type: 'skill', category: 'skills',
      description: 'Vue.js, Nuxt.js, TypeScript, React',
      size: 22 },
    { id: 'skill-stats', label: 'Statistics', type: 'skill', category: 'skills',
      description: 'Bayesian Modeling, PyMC3, Classical Stats',
      size: 20 },
    { id: 'skill-dataviz', label: 'Data Viz', type: 'skill', category: 'skills',
      description: 'D3.js, Matplotlib, Interactive Viz',
      size: 18 },
    { id: 'skill-cogphil', label: 'Cognitive Philosophy', type: 'skill', category: 'skills',
      description: 'Philosophy of Mind, Phenomenology, Consciousness Studies',
      size: 20 },
  ],
  links: [
    // Person to current employment/education
    { source: 'tom', target: 'vua-phd', strength: 2 },
    
    // Employment connections
    { source: 'tom', target: 'vua-ta', strength: 1.5 },
    { source: 'tom', target: 'spinoza', strength: 1.5 },
    { source: 'tom', target: 'ens', strength: 1.5 },
    { source: 'tom', target: 'sweeeft', strength: 1.5 },
    
    // Education connections
    { source: 'tom', target: 'vua-msc', strength: 2 },
    { source: 'tom', target: 'ensc', strength: 2 },
    { source: 'tom', target: 'sorbonne', strength: 1.5 },
    
    // Education to Employment
    { source: 'vua-msc', target: 'vua-phd', strength: 1.5 },
    { source: 'vua-msc', target: 'vua-ta', strength: 1 },
    { source: 'vua-msc', target: 'spinoza', strength: 1 },
    { source: 'ensc', target: 'spinoza', strength: 1 },
    { source: 'ensc', target: 'ens', strength: 1 },
    { source: 'sorbonne', target: 'ensc', strength: 1 },
    
    // Publications connections
    { source: 'spinoza', target: 'pub-biorxiv', strength: 1 },
    { source: 'vua-msc', target: 'pub-pmlr', strength: 1 },
    { source: 'ens', target: 'pub-plos', strength: 1 },
    
    // Projects to employment/education
    { source: 'vua-msc', target: 'proj-vision', strength: 0.8 },
    { source: 'ensc', target: 'proj-podcast', strength: 0.8 },
    { source: 'ens', target: 'proj-network', strength: 0.8 },
    { source: 'ensc', target: 'proj-ngo', strength: 0.5 },
    
    // Skills to various nodes
    { source: 'skill-ai', target: 'vua-phd', strength: 1.5 },
    { source: 'skill-ai', target: 'vua-msc', strength: 1.5 },
    { source: 'skill-ai', target: 'pub-pmlr', strength: 1 },
    { source: 'skill-neuro', target: 'spinoza', strength: 1.5 },
    { source: 'skill-neuro', target: 'ensc', strength: 1.5 },
    { source: 'skill-neuro', target: 'pub-biorxiv', strength: 1 },
    { source: 'skill-python', target: 'vua-msc', strength: 1 },
    { source: 'skill-python', target: 'spinoza', strength: 1 },
    { source: 'skill-python', target: 'ens', strength: 1 },
    { source: 'skill-web', target: 'sweeeft', strength: 1.5 },
    { source: 'skill-web', target: 'proj-podcast', strength: 1 },
    { source: 'skill-stats', target: 'ensc', strength: 1 },
    { source: 'skill-stats', target: 'spinoza', strength: 1 },
    { source: 'skill-stats', target: 'pub-plos', strength: 1 },
    { source: 'skill-dataviz', target: 'proj-network', strength: 1 },
    { source: 'skill-dataviz', target: 'sweeeft', strength: 0.8 },
    { source: 'skill-cogphil', target: 'pub-plos', strength: 1.5 },
    { source: 'skill-cogphil', target: 'sorbonne', strength: 1 },
    { source: 'skill-cogphil', target: 'ensc', strength: 1 },
  ]
}

const nodeColors = {
  person: '#1F2937',
  employment: '#3B82F6',
  education: '#10B981',
  skill: '#F59E0B',
  publication: '#EF4444',
  project: '#8B5CF6'
}

// D3 visualization elements stored as refs
let svg = null
let simulation = null
let link = null
let node = null
let nodeGroup = null
let zoom = null
let g = null

const toggleFilter = (filterId) => {
  const index = activeFilters.value.indexOf(filterId)
  if (index > -1) {
    activeFilters.value.splice(index, 1)
  } else {
    activeFilters.value.push(filterId)
  }
  updateVisualization()
}

const fitToNodes = () => {
  if (!svg || !cvData.nodes.length) return
  // Calculate bounding box of all nodes
  const xs = cvData.nodes.map(n => n.x || 0)
  const ys = cvData.nodes.map(n => n.y || 0)
  const minX = Math.min(...xs)
  const maxX = Math.max(...xs)
  const minY = Math.min(...ys)
  const maxY = Math.max(...ys)
  const width = networkContainer.value.clientWidth
  const height = networkContainer.value.clientHeight
  const nodesWidth = maxX - minX
  const nodesHeight = maxY - minY
  // Calculate scale and center
  const scale = Math.min(
    width / (nodesWidth + 80),
    height / (nodesHeight + 80),
    1
  )
  const tx = width / 2 - scale * (minX + nodesWidth / 2)
  const ty = height / 2 - scale * (minY + nodesHeight / 2)
  svg.transition().duration(500).call(zoom.transform, d3.zoomIdentity.translate(tx, ty).scale(scale))
}

const resetView = () => {
  if (svg && zoom) {
    fitToNodes()
  }
  simulation?.alpha(0.3).restart()
}

const updateVisualization = () => {
  // Filter nodes and links based on active filters
  const filteredNodes = cvData.nodes.filter(n => 
    n.type === 'person' || activeFilters.value.includes(n.category)
  )
  const filteredNodeIds = new Set(filteredNodes.map(n => n.id))
  const filteredLinks = cvData.links.filter(l => 
    filteredNodeIds.has(l.source.id || l.source) && 
    filteredNodeIds.has(l.target.id || l.target)
  )

  // Update visibility using opacity for SVG elements
  nodeGroup.style('opacity', d => 
    d.type === 'person' || activeFilters.value.includes(d.category) ? 1 : 0
  )
  link.style('opacity', l => {
    const sourceId = l.source.id || l.source
    const targetId = l.target.id || l.target
    return filteredNodeIds.has(sourceId) && filteredNodeIds.has(targetId) ? 0.3 : 0
  })

  simulation.nodes(filteredNodes)
  simulation.force('link').links(filteredLinks)
  simulation.alpha(0.3).restart()
}

const initVisualization = () => {
  const container = networkContainer.value
  const width = container.clientWidth
  const height = container.clientHeight

  // Clear existing SVG
  d3.select(container).selectAll('*').remove()

  // Create SVG
  svg = d3.select(container)
    .append('svg')
    .attr('width', width)
    .attr('height', height)

  // Add zoom behavior
  zoom = d3.zoom()
    .scaleExtent([0.3, 3])
    .on('zoom', (event) => {
      g.attr('transform', event.transform)
    })

  svg.call(zoom)

  g = svg.append('g')

  // Create arrow markers for directed edges
  const defs = svg.append('defs')
  
  defs.selectAll('marker')
    .data(['end'])
    .enter().append('marker')
    .attr('id', 'arrowhead')
    .attr('viewBox', '0 -5 10 10')
    .attr('refX', 20)
    .attr('refY', 0)
    .attr('markerWidth', 6)
    .attr('markerHeight', 6)
    .attr('orient', 'auto')
    .append('path')
    .attr('d', 'M0,-5L10,0L0,5')
    .attr('fill', '#999')

  // Create circular clip path for profile image
  defs.append('clipPath')
    .attr('id', 'profile-clip')
    .append('circle')
    .attr('r', 40)
    .attr('cx', 0)
    .attr('cy', 0)

  // Create force simulation
  simulation = d3.forceSimulation(cvData.nodes)
    .force('link', d3.forceLink(cvData.links)
      .id(d => d.id)
      .distance(d => 100 / (d.strength || 1))
      .strength(d => d.strength * 0.3))
    .force('charge', d3.forceManyBody().strength(-400))
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force('collision', d3.forceCollide().radius(d => d.size + 5))

  // Create links
  link = g.append('g')
    .selectAll('line')
    .data(cvData.links)
    .enter().append('line')
    .attr('class', 'link')
    .attr('stroke', '#999')
    .attr('stroke-opacity', 0.3)
    .attr('stroke-width', d => Math.sqrt(d.strength || 1) * 1.5)

  // Create nodes
  nodeGroup = g.append('g')
    .selectAll('g')
    .data(cvData.nodes)
    .enter().append('g')
    .attr('class', 'node-group')
    .call(d3.drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended))

  node = nodeGroup.append('circle')
    .attr('r', d => d.size || 15)
    .attr('fill', d => nodeColors[d.type] || '#6B7280')
    .attr('stroke', '#fff')
    .attr('stroke-width', 2)
    .style('cursor', 'pointer')
    .on('click', (event, d) => {
      event.stopPropagation()
      selectedNode.value = d
    })

  // Add profile image for the central Tom node
  nodeGroup.filter(d => d.id === 'tom')
    .append('image')
    .attr('xlink:href', '/images/Tom.jpeg')
    .attr('x', -40)
    .attr('y', -40)
    .attr('width', 80)
    .attr('height', 80)
    .attr('clip-path', 'url(#profile-clip)')
    .style('cursor', 'pointer')
    .on('click', (event, d) => {
      event.stopPropagation()
      selectedNode.value = d
    })

  // Add hover effects to all nodes
  node.on('mouseover', function(event, d) {
      d3.select(this)
        .transition()
        .duration(200)
        .attr('r', (d.size || 15) * 1.2)
        .attr('stroke-width', 3)
      
      // Highlight connected nodes
      const connectedNodeIds = new Set()
      cvData.links.forEach(l => {
        if (l.source.id === d.id || l.source === d.id) {
          connectedNodeIds.add(l.target.id || l.target)
        }
        if (l.target.id === d.id || l.target === d.id) {
          connectedNodeIds.add(l.source.id || l.source)
        }
      })
      
      nodeGroup.selectAll('circle')
        .transition()
        .duration(200)
        .style('opacity', node => 
          node.id === d.id || connectedNodeIds.has(node.id) ? 1 : 0.3
        )
      
      link.transition()
        .duration(200)
        .style('opacity', l => 
          (l.source.id === d.id || l.source === d.id || 
           l.target.id === d.id || l.target === d.id) ? 0.8 : 0.1
        )
    })
    .on('mouseout', function(event, d) {
      d3.select(this)
        .transition()
        .duration(200)
        .attr('r', d.size || 15)
        .attr('stroke-width', 2)
      
      nodeGroup.selectAll('circle')
        .transition()
        .duration(200)
        .style('opacity', 1)
      
      link.transition()
        .duration(200)
        .style('opacity', 0.3)
    })

  // Add labels
  nodeGroup.append('text')
    .text(d => d.label)
    .attr('dx', d => (d.size || 15) + 5)
    .attr('dy', 4)
    .style('font-size', d => d.type === 'person' ? '16px' : '12px')
    .style('font-weight', d => d.type === 'person' ? 'bold' : 'normal')
    .style('fill', '#1F2937')
    .style('pointer-events', 'none')

  // Update positions on tick
  simulation.on('tick', () => {
    link
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y)

    nodeGroup.attr('transform', d => `translate(${d.x},${d.y})`)
  })
  // Fit view after initial layout
  setTimeout(fitToNodes, 600)

  // Drag functions
  function dragstarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart()
    d.fx = d.x
    d.fy = d.y
  }

  function dragged(event, d) {
    d.fx = event.x
    d.fy = event.y
  }

  function dragended(event, d) {
    if (!event.active) simulation.alphaTarget(0)
    if (!d.fixed) {
      d.fx = null
      d.fy = null
    }
  }

  // Close info panel when clicking on background
  svg.on('click', () => {
    selectedNode.value = null
  })
}

onMounted(() => {
  initVisualization()
  window.addEventListener('resize', initVisualization)
})

onUnmounted(() => {
  window.removeEventListener('resize', initVisualization)
  if (simulation) simulation.stop()
})
</script>

<style scoped>
.cv-network-container {
  width: 100%;
  aspect-ratio: 5 / 4;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  position: relative;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  border-radius: 18px;
  box-shadow: 0 8px 32px rgba(31, 41, 51, 0.18);
}

.header {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 10;
  background: rgba(255, 255, 255, 0.95);
  padding: 20px 30px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.header h1 {
  margin: 0;
  font-size: 24px;
  color: #1F2937;
}

.tagline {
  margin: 5px 0 0 0;
  font-size: 14px;
  color: #6B7280;
}

.controls {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 10;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  max-width: 500px;
}

.filter-btn {
  padding: 8px 16px;
  border: 2px solid;
  border-radius: 20px;
  background: white;
  color: inherit;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.filter-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.reset-btn {
  padding: 8px 16px;
  border: 2px solid #6B7280;
  border-radius: 20px;
  background: white;
  color: #6B7280;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.reset-btn:hover {
  background: #6B7280;
  color: white;
  transform: translateY(-2px);
}

.network-svg-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.info-panel {
  position: absolute;
  bottom: 20px;
  left: 20px;
  max-width: 400px;
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  z-index: 20;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 28px;
  color: #9CA3AF;
  cursor: pointer;
  line-height: 1;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s;
}

.close-btn:hover {
  background: #F3F4F6;
  color: #1F2937;
}

.info-panel h3 {
  margin: 0 0 8px 0;
  font-size: 20px;
  color: #1F2937;
  padding-right: 30px;
}

.node-type {
  display: inline-block;
  margin: 0 0 12px 0;
  padding: 4px 12px;
  background: #F3F4F6;
  border-radius: 12px;
  font-size: 12px;
  text-transform: uppercase;
  font-weight: 600;
  color: #6B7280;
}

.description {
  margin-bottom: 12px;
  color: #4B5563;
  line-height: 1.6;
  font-size: 14px;
}

.period, .location {
  margin-bottom: 8px;
  color: #6B7280;
  font-size: 13px;
}

.details {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #E5E7EB;
}

.details ul {
  margin: 0;
  padding-left: 20px;
}

.details li {
  margin-bottom: 6px;
  color: #4B5563;
  font-size: 13px;
  line-height: 1.5;
}

.external-link {
  display: inline-block;
  margin-top: 16px;
  padding: 8px 16px;
  background: #3B82F6;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.2s;
}

.external-link:hover {
  background: #2563EB;
  transform: translateX(2px);
}

@media (max-width: 768px) {
  .header {
    left: 10px;
    top: 10px;
    padding: 15px 20px;
  }

  .header h1 {
    font-size: 18px;
  }

  .controls {
    top: auto;
    bottom: 10px;
    right: 10px;
    left: 10px;
    justify-content: center;
  }

  .info-panel {
    left: 10px;
    right: 10px;
    bottom: 80px;
    max-width: none;
  }
}
</style>
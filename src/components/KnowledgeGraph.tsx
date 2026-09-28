import { buildGraph, graphJson, type GraphInput } from '@/lib/knowledge-graph';

/** The page's single schema.org @graph (addendum §3b). Server component. */
export default function KnowledgeGraph(props: GraphInput) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: graphJson(buildGraph(props)) }} />;
}

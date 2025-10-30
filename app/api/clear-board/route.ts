import { NextResponse } from 'next/server';

const BASE_URL = "https://board-v25.vercel.app";

async function clearEndpoint(endpoint: string) {
  const response = await fetch(`${BASE_URL}${endpoint}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch from ${endpoint}`);
  }

  const data = await response.json();
  
  // Filter items to delete (exclude 'raw' and 'single-encounter' items)
  const itemsToDelete = data.filter((item: any) => {
    const id = item.id || '';
    return !id.includes('raw') && !id.includes('single-encounter');
  });

  // Delete filtered items
  const deletePromises = itemsToDelete
    .filter((item: any) => {
      const id = item.id;
      return id.startsWith('enhanced') || 
             id.startsWith('item') || 
             id.startsWith('doctor-note');
    })
    .map(async (item: any) => {
      const deleteResponse = await fetch(
        `${BASE_URL}/api/board-items/${item.id}`,
        { method: 'DELETE' }
      );
      return {
        id: item.id,
        endpoint,
        status: deleteResponse.status,
        result: await deleteResponse.json()
      };
    });

  return await Promise.all(deletePromises);
}

export async function POST() {
  try {
    // Clear both board-items and selected-item endpoints
    const [boardItemsResults, selectedItemResults] = await Promise.all([
      clearEndpoint('/api/board-items'),
      clearEndpoint('/api/selected-item')
    ]);

    const allResults = [...boardItemsResults, ...selectedItemResults];

    return NextResponse.json({
      success: true,
      deletedCount: allResults.length,
      boardItems: boardItemsResults.length,
      selectedItems: selectedItemResults.length,
      results: allResults
    });
  } catch (error) {
    console.error('Error clearing board:', error);
    return NextResponse.json(
      { error: `Failed to clear board items: ${error}` },
      { status: 500 }
    );
  }
}

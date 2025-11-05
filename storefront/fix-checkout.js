const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'app', 'checkout', 'page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Replace the handleShippingSubmit function
const oldCode = `  const handleShippingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedShipping) {
      setError('Please select a shipping method');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // First, check the current order state
      console.log('[DEBUG] Checking current order state before setting shipping method');
      const orderCheck = await graphqlClient.query(GET_ACTIVE_ORDER, {});
      console.log('[DEBUG] Current order state:', orderCheck.data?.activeOrder?.state);

      // If order is in AddingItems state, transition to ArrangingShipping first
      if (orderCheck.data?.activeOrder?.state === 'AddingItems') {
        console.log('[DEBUG] Transitioning order from AddingItems to ArrangingShipping');
        const transitionResult = await graphqlClient.mutation(TRANSITION_TO_STATE, {
          state: 'ArrangingShipping',
        });
        console.log('[DEBUG] Transition result:', transitionResult);

        if (transitionResult.data?.transitionOrderToState?.errorCode) {
          setError(transitionResult.data.transitionOrderToState.message || 'Failed to prepare order for shipping');
          setLoading(false);
          return;
        }
      }

      console.log('[DEBUG] Setting shipping method:', selectedShipping);`;

const newCode = `  const handleShippingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedShipping) {
      setError('Please select a shipping method');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('[DEBUG] Setting shipping method:', selectedShipping);`;

content = content.replace(oldCode, newCode);

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ Fixed checkout page - removed invalid state transition');

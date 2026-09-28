import {expect, test} from 'vitest'
import {render} from 'vitest-browser-react'

import {StudioLogo} from '../../../components/StudioLogo'

test('studio logo shows the Woodbrook brand in the browser', async () => {
  const screen = await render(<StudioLogo />)

  await expect.element(screen.getByText('Woodbrook Residents')).toBeVisible()
  await expect.element(screen.getByText('W', {exact: true})).toBeVisible()
})

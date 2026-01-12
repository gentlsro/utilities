import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import { blurFocusedInput } from '../../../app/utils/blur-focused-input'

describe('blurFocusedInput', () => {
  beforeEach(() => {
    // Reset document.activeElement before each test
    if (document.activeElement && document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }
  })

  it('should blur focused input element', async () => {
    const inputEl = mount({
      template: '<input id="test-input" />',
    }, { attachTo: '#__nuxt' })

    inputEl.element.focus()

    // Verify input is focused
    expect(document.activeElement).toBe(inputEl.element)

    // Call blur function
    blurFocusedInput()

    // Verify the inputEl is no longer focused
    expect(document.activeElement).not.toBe(inputEl.element)
  })

  it('should blur focused textarea element', async () => {
    const inputEl = mount({
      template: '<textarea id="test-textarea" />',
    }, { attachTo: '#__nuxt' })

    inputEl.element.focus()

    expect(document.activeElement).toBe(inputEl.element)

    blurFocusedInput()

    expect(document.activeElement).not.toBe(inputEl.element)
  })

  it('should blur contentEditable element', async () => {
    const inputEl = mount({
      template: '<div id="test-editable" contenteditable="true" />',
    }, { attachTo: '#__nuxt' })

    inputEl.element.focus()

    expect(document.activeElement).toBe(inputEl.element)

    blurFocusedInput()

    expect(document.activeElement).not.toBe(inputEl.element)
  })

  it('should not blur non-input elements', () => {
    const el = mount({
      template: '<button id="test-button" />',
    }, { attachTo: '#__nuxt' })

    el.element.focus()

    expect(document.activeElement).toBe(el.element)

    // Should not throw error
    blurFocusedInput()

    // Button should still be focused
    expect(document.activeElement).toBe(el.element)
  })

  it('should handle case when no element is focused', () => {
    // Ensure no element is focused
    if (document.activeElement && document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }

    // Should not throw error
    expect(() => blurFocusedInput()).not.toThrow()
  })
})

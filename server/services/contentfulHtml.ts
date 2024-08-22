import { Block, BLOCKS, Document, Inline, INLINES, MARKS } from '@contentful/rich-text-types'
import logger from '../../logger'
import { documentToHtmlString, Next, Options } from '@contentful/rich-text-html-renderer'
import { BreaklineEntry, ButtonEntry, WarningSkeleton } from './contentfulTypes'

const buttonComponent = 'componentHeroBanner'
const warningComponent = 'warning'
const breakLineComponent = 'breakline'

const mapButton = (target: ButtonEntry) => {
  let icon = ''
  if (target?.fields?.icon) {
    icon = `<svg class="${target?.fields?.icon}" xmlns="http://www.w3.org/2000/svg" width="17.5" height="19" viewBox="0 0 33 40" aria-hidden="true" focusable="false">
          <path fill="currentColor" d="M0 0h13l20 20-20 20H0l20-20z"></path>
        </svg>`
  }
  return `<a href="${target?.fields?.link}" role="button" draggable="false" class="govuk-button govuk-button--start govuk-!-margin-top-4" data-module="govuk-button" data-qa="${target?.fields?.qatag}">
        ${target?.fields?.text}${icon}</a>`
}

const mapWarning = (target: WarningSkeleton) => {
  return `<div class="govuk-warning-text">
  <span class="govuk-warning-text__icon" aria-hidden="true">!</span>
  <strong class="govuk-warning-text__text">
    <span class="govuk-visually-hidden">{{ t('generic-page-warning') }}</span>
    ${target?.fields?.text}
  </strong>
</div>`
}

function appendBr(n: number): string {
  return Array(n).fill('<br>').join('')
}

const mapBreakline = (target: BreaklineEntry) => {
  return appendBr((target?.fields?.lines as number) || 1)
}

const options = {
  renderMark: {
    [MARKS.BOLD]: (text: string) => `<strong>${text}</strong>`,
    [MARKS.ITALIC]: (text: string) => `<em>${text}</em>`,
  },
  renderNode: {
    [INLINES.EMBEDDED_ENTRY]: (node: Block | Inline, _: Next) => {
      const target = node?.data?.target
      const type = target?.sys?.contentType?.sys?.id
      switch (type) {
        case buttonComponent:
          return mapButton(target)
        case warningComponent:
          return mapWarning(target)
        case breakLineComponent:
          return mapBreakline(target)
        default:
          logger.error('Contentful error could not map embedded entry: ', JSON.stringify(node))
          return ''
      }
    },
    [BLOCKS.HEADING_1]: (node: Block | Inline, next: Next) =>
      `<h1 class="govuk-heading-xl govuk-!-margin-top-6">${next(node.content)}</h1>`,
    [BLOCKS.HEADING_2]: (node: Block | Inline, next: Next) =>
      `<h2 class="govuk-heading-l govuk-!-margin-top-5">${next(node.content)}</h2>`,
    [BLOCKS.HEADING_3]: (node: Block | Inline, next: Next) =>
      `<h3 class="govuk-heading-m govuk-!-margin-top-4">${next(node.content)}</h3>`,
    [BLOCKS.HEADING_4]: (node: Block | Inline, next: Next) =>
      `<h4 class="govuk-heading-s govuk-!-margin-top-3">${next(node.content)}</h4>`,
    [BLOCKS.UL_LIST]: (node: Block | Inline, next: Next) =>
      `<ul class="govuk-body-m govuk-!-margin-top-4">${next(node.content)}</ul>`,
    [BLOCKS.OL_LIST]: (node: Block | Inline, next: Next) =>
      `<ol class="govuk-body-m govuk-!-margin-top-4">${next(node.content)}</ol>`,
    [BLOCKS.PARAGRAPH]: (node: Block | Inline, next: Next) => `<p class="govuk-body-m">${next(node.content)}</p>`,
    [BLOCKS.QUOTE]: (node: Block | Inline, next: Next) => `<div class="govuk-inset-text">${next(node.content)}</div>`,
    [BLOCKS.TABLE]: (node: Block | Inline, next: Next) =>
      `<table class="govuk-table govuk-!-margin-top-4">${next(node.content)}</table>`,
    [BLOCKS.TABLE_HEADER_CELL]: (node: Block | Inline, next: Next) =>
      `<th class="govuk-table__header">${next(node.content)}</th>`,
    [BLOCKS.TABLE_ROW]: (node: Block | Inline, next: Next) => `<tr class="govuk-table__row">${next(node.content)}</tr>`,
    [BLOCKS.TABLE_CELL]: (node: Block | Inline, next: Next) =>
      `<td class="govuk-table__cell">${next(node.content)}</td>`,
    [BLOCKS.EMBEDDED_ASSET]: (node: Block | Inline, _: Next) =>
      `< (node: Block | Inline, next: Next) class="govuk-!-margin-top-6 govuk-!-margin-bottom-6"><img src="https:${node.data.fields.file.url}" alt="${node.data.fields.description}" /></figure>`,
    [INLINES.HYPERLINK]: (node: Block | Inline, next: Next) =>
      `<a class="govuk-link" href="${node.data.uri}">${next(node.content)}</a>`,
  },
} as Partial<Options>

export const convertToHTMLFormat = (body: Document) => documentToHtmlString(body, options)

import Component from '@glimmer/component';
import {action} from '@ember/object';
import {inject as service} from '@ember/service';

const TWO_COLUMN_WIDTH = 540;
const THREE_COLUMN_WIDTH = 940;

export default class GhTenorComponent extends Component {
    @service tenor;

    willDestroy() {
        super.willDestroy(...arguments);
        this._resizeObserver?.disconnect();
    }

    @action
    search(event) {
        const term = event.target.value;
        this.tenor.updateSearch(term);
        this.closeZoom();
    }

    @action
    postInsertSetup(containerElem) {
        if (this.args.searchTerm !== this.tenor.searchTerm) {
            this.tenor.updateSearch(this.args.searchTerm);
        }

        this._resizeObserver = new ResizeObserver((entries) => {
            const [containerEntry] = entries;
            const contentBoxSize = Array.isArray(containerEntry.contentBoxSize) ? containerEntry.contentBoxSize[0] : containerEntry.contentBoxSize;

            const width = contentBoxSize.inlineSize;

            let columns = 4;

            if (width <= TWO_COLUMN_WIDTH) {
                columns = 2;
            } else if (width <= THREE_COLUMN_WIDTH) {
                columns = 3;
            }

            this.tenor.changeColumnCount(columns);
        });
        this._resizeObserver.observe(containerElem);
    }

    @action
    select(gif, event) {
        event?.preventDefault();
        event?.stopPropagation();

        const media = gif.media[0].gif;

        const selectParams = {
            src: media.url,
            width: media.dims[0],
            height: media.dims[1],
            caption: '(Via <a href="https://tenor.com">Tenor</a>)'
        };

        this.args.select(selectParams);
        this.args.close();
    }

    @action
    handleEscape() {
        this.args.close();
    }
}
